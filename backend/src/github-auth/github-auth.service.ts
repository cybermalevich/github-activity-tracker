import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import getRandomString from "../utils/getRandomString";
import axios from "axios";
import { EntityManager } from "typeorm";
import { User } from "../entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Rep } from "../entities/rep.entity";
import { UserEvent } from "../entities/user_events.entity";

@Injectable()
export class GithubAuthService {
  constructor(private EntityManager: EntityManager,
              private ConfigService: ConfigService) {
  }

  async requestAccessToken(code: string): Promise<string | null> {
    const res = await axios.post(this.ConfigService.get("GET_ACCESS_TOKEN_URL"), {
      code,
      client_id: this.ConfigService.get("CLIENT_ID"),
      client_secret: this.ConfigService.get("CLIENT_SECRET")
    });

    return res.status === 200 ? new URLSearchParams(res.data).get("access_token") : null;
  }

  async saveUser(githubAccessToken: string): Promise<HttpException | string> {
    let result;

    try {
      result = await axios.get(this.ConfigService.get("GITHUB_API_USER"), {
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

    const { data: { id: githubId, ...data } } = result;
    const { login } = data;
    const accessToken = getRandomString(40);
    const profileUrl = this.ConfigService.get("GITHUB_USER_PROFILE_URL").replace("{USERNAME}", login);

    const user = this.EntityManager.create(User, {
      ...data,
      id: login,
      github_id: githubId,
      github_access_token: githubAccessToken,
      access_token: accessToken,
      profile_url: profileUrl
    });

    await this.EntityManager.save(user);

    return user.id;
  }

  async populateUserReps(userId: string): Promise<void> {
    const user = await this.EntityManager.findOne(User, {
      id: userId
    });

    const { data } = await axios(this.ConfigService.get("GITHUB_API_USER_EVENTS")
      .replace("{USERNAME}", user.id));

    if (data instanceof Array) {
      interface INameObjRepMap {
        [key: string]: Rep;
      }

      const nameObjRepMap: INameObjRepMap = {};
      const userEvents: UserEvent[] = [];

      for (const {
        id: githubId,
        type,
        payload,
        created_at,
        repo: { id: repoId, name }
      } of data) {

        if (!nameObjRepMap[repoId]) {
          const repUrl = `${this.ConfigService.get("GITHUB_URL")}/${name}`;
          const rep = this.EntityManager.create(Rep, {
            name,
            github_id: repoId,
            url: repUrl
          });

          const existingRep = await this.EntityManager.findOne(Rep, {
            github_id: repoId
          });

          if (!existingRep) {
            await this.EntityManager.insert(Rep, rep);
            user.reps.push(rep);
          }

          nameObjRepMap[repoId] = rep;
        }

        userEvents.push(this.EntityManager.create(UserEvent, {
          github_id: githubId,
          type,
          payload: payload,
          created_at,
          user,
          rep: nameObjRepMap[repoId]
        }));
      }

      for (let userEvent of userEvents) {
        const { github_id } = userEvent;
        const existingUserEvent = await this.EntityManager.findOne(UserEvent, {
          github_id
        });

        if (!existingUserEvent) {
          await this.EntityManager.save(UserEvent, userEvent);
        }
      }

      await this.EntityManager.save(user);
    }
  }

  async populateRepsCommits() {
  }
}
