import { HttpException, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User } from "../entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { ConfigService } from "@nestjs/config";
import generateUrl from "../utils/generateUrl";
import { BaseUser } from "./types";

@Injectable()
export class UsersService {
  constructor(
    private EntityManager: EntityManager,
    private AuthService: AuthService,
    private ConfigService: ConfigService
  ) {
  }

  async createAndSaveUser(user: BaseUser): Promise<HttpException | User> {
    const { access_token: accessToken } = await this.AuthService.login({
      id: user.id,
      githubId: user.github_id
    });
    const profileUrl = generateUrl(this.ConfigService.get("GITHUB_USER_PROFILE_URL"), {
      USERNAME: user.id
    });

    return await this.EntityManager.save(this.EntityManager.create(User, {
      ...user,
      access_token: accessToken,
      profile_url: profileUrl
    }));
  }
}
