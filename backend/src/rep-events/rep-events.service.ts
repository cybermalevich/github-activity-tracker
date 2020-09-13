import { Injectable } from "@nestjs/common";
import { Rep } from "../entities/rep.entity";
import { UserEvent } from "../entities/user_events.entity";
import { User } from "../entities/user.entity";
import generateUrl from "../utils/generateUrl";
import axios from "axios";
import { EntityManager } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { GithubDataFetchingService } from "../github-data-fetching/github-data-fetching.service";

@Injectable()
export class RepEventsService {
  constructor(
    private EntityManager: EntityManager,
    private GithubDataFetchingService: GithubDataFetchingService,
    private ConfigService: ConfigService
  ) {
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
      rep.userEvents = [];
      const { name: repName } = rep;
      const data = await this.GithubDataFetchingService.getRepEvents(repName);

      for (const {
        id: userEventId,
        type,
        payload,
        repo: { id: repoId, },
        actor: { id: userId, login },
        created_at: createdAt
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
            })
          });

          users[userId] = user;
          user.userEvents = [];
          user.reps = [];
          user.reps.push(rep);
        }

        if (!userEvents[userEventId]) {
          const userEvent = this.EntityManager.create(UserEvent, {
            type,
            payload,
            github_id: userEventId,
            rep_id: rep.id,
            created_at: createdAt
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
