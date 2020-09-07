import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth/auth.service";
import { User } from "../entities/user.entity";
import { Rep } from "../entities/rep.entity";
import { UserEvent } from "../entities/user_events.entity";
import generateUrl from "../utils/generateUrl";
import { RepUser } from "../entities/rep_user.entity";

@Injectable()
export class GithubAuthService {
  clientId: number;

  clientSecret: string;

  constructor(private EntityManager: EntityManager,
              private ConfigService: ConfigService,
              private AuthService: AuthService) {
    this.clientId = this.ConfigService.get("GITHUB_CLIENT_ID");
    this.clientSecret = this.ConfigService.get("GITHUB_CLIENT_SECRET");
  }

  async requestAccessToken(code: string): Promise<string> {
    try {
      const res = await axios.post(this.ConfigService.get("GET_ACCESS_TOKEN_URL"), {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      return new URLSearchParams(res.data).get("access_token");
    } catch (error) {
      throw new HttpException("Wrong code", HttpStatus.UNAUTHORIZED);
    }
  }

  async saveUser(githubAccessToken: string): Promise<HttpException | User> {
    let result;

    try {
      result = await axios.get(this.ConfigService.get("GITHUB_API_AUTHENTICATED_USER"), {
        headers: {
          "Authorization": `token ${githubAccessToken}`
        }
      });
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      } else if (error.request) {
        throw new HttpException("Service Unavailable", HttpStatus.SERVICE_UNAVAILABLE);
      }
    }

    const { data: { id: githubId, login, ...data } } = result;
    const { access_token: accessToken } = await this.AuthService.login({
      username: login,
      githubId: githubId,
    });
    const profileUrl = generateUrl(this.ConfigService.get("GITHUB_USER_PROFILE_URL"), {
      USERNAME: login
    });

    const user = this.EntityManager.create(User, {
      ...data,
      id: login,
      github_id: githubId,
      github_access_token: githubAccessToken,
      access_token: accessToken,
      profile_url: profileUrl
    });

    await this.EntityManager.save(user);

    return user;
  }

  async populateUserReps(userId: string): Promise<Rep[]> {
    const user = await this.EntityManager.findOne(User, {
      id: userId
    });
    const userReps = user.reps.reduce((acc, el) => {
      acc[el.github_id] = el;
      return acc;
    }, {});

    const userRepsForInsert: Rep[] = [];
    const githubApiUserEventsUrl = generateUrl(this.ConfigService.get("GITHUB_API_USER_EVENTS"), {
      USERNAME: userId
    });

    const { data } = await axios(githubApiUserEventsUrl);
    if (data instanceof Array) {
      for (const {
        repo: { id: repoId, name: repoName },
      } of data) {
        if (!userReps[repoId]) {
          const rep = this.EntityManager.create(Rep, {
            github_id: repoId,
            name: repoName,
            url: generateUrl(this.ConfigService.get("GITHUB_REPOSITORY_URL"), {
              REPO_FULL_NAME: repoName
            })
          });
          rep.userEvents = [];
          userReps[repoId] = rep;
          user.reps.push(userReps[repoId]);
          userRepsForInsert.push(rep);
        }
      }
    }

    await this.EntityManager.save(Rep, userRepsForInsert);
    await this.EntityManager.save(user);

    return userRepsForInsert;
  }

  async populateRepsEvents(reps: Rep[]): Promise<void> {
    const userEvents = (await this.EntityManager.find(UserEvent)).reduce((acc, el) => {
      acc[el.github_id] = el;
      return acc;
    }, {});
    const users = (await this.EntityManager.find(User)).reduce((acc, el) => {
      acc[el.github_id] = el;
      return acc;
    }, {});

    for (const rep of reps) {
      rep.users = [];
      const { name: repName } = rep;
      const githubApiRepoEvents = generateUrl(this.ConfigService.get("GITHUB_API_REPO_EVENTS"), {
        REPO_FULL_NAME: repName
      });
      const { data } = await axios(githubApiRepoEvents);

      for (const {
        id: userEventId,
        type,
        payload,
        repo: { id: repoId, },
        actor: { id: userId, login },
      } of data) {
        if (!users[userId]) {
          const githubApiUserUrl = generateUrl(this.ConfigService.get("GITHUB_API_USER"), {
            USERNAME: login
          });
          const { data } = await axios.get(githubApiUserUrl);
          const { name: userName, avatar_url } = data;
          const user = this.EntityManager.create(User, {
            id: login,
            github_id: userId,
            name: userName,
            avatar_url,
            profile_url: generateUrl(this.ConfigService.get("GITHUB_USER_PROFILE_URL"), {
              USERNAME: login
            }),
          });

          users[userId] = user;
          user.userEvents = [];
          user.reps = [];
          user.reps.push(rep);
        }

        if (!userEvents[repoId]) {
          const userEvent = this.EntityManager.create(UserEvent, {
            type,
            payload,
            github_id: userEventId,
            rep_id: rep.id
          });

          userEvents[userEventId] = userEvent;
          users[userId].userEvents.push(userEvent);
          rep.userEvents.push(userEvent);
        }
      }

      const eventsForSave = Object.values(userEvents);
      const usersForSave = Object.values(users);
      await this.EntityManager.save(eventsForSave);
      await this.EntityManager.save(usersForSave);
    }
  }
}
