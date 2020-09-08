import { Injectable } from "@nestjs/common";
import { EntityManager, IsNull, Not } from "typeorm";
import { User } from "../entities/user.entity";
import { GithubDataFetchingService } from "../github-data-fetching/github-data-fetching.service";
import { UsersService } from "../users/users.service";
import { RepsService } from "../reps/reps.service";
import { RepEventsService } from "../rep-events/rep-events.service";

@Injectable()
export class CreationalJobsService {
  constructor(
    private GithubDataFetchingService: GithubDataFetchingService,
    private UsersService: UsersService,
    private RepsService: RepsService,
    private RepEventsService: RepEventsService,
    private EntityManager: EntityManager
  ) {
  }

  async fetchAndSaveGithubUserData(accessToken: string) {
    const userData = await this.GithubDataFetchingService.getUserDataByAccessToken(accessToken);
    const user = await this.UsersService.createAndSaveUser(userData);

    if (user instanceof User) {
      const reps = await this.GithubDataFetchingService.getRepsWithUserActivity(user.id);
      const insertedReps = await this.RepsService.populateUserReps(user.id, reps);
      await this.RepEventsService.populateRepsEvents(insertedReps);
    }
  }

  async updateGithubDataForAllAuthorizedUsers(): Promise<void> {
    const authorizedUsers: User[] = await this.EntityManager.find(User, {
      where: {
        access_token: Not(IsNull())
      }
    });

    for (const user of authorizedUsers) {
      await this.fetchAndSaveGithubUserData(user.access_token);
    }
  }
}
