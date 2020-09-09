import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EntityManager } from "typeorm";
import axios from "axios";
import generateUrl from "../utils/generateUrl";
import { Rep } from "../entities/rep.entity";
import { BaseUser } from "../users/types";

@Injectable()
export class GithubDataFetchingService {
  clientId: number;

  clientSecret: string;

  constructor(
    private ConfigService: ConfigService,
    private EntityManager: EntityManager
  ) {
    this.clientId = this.ConfigService.get("GITHUB_CLIENT_ID");
    this.clientSecret = this.ConfigService.get("GITHUB_CLIENT_SECRET");
  }

  async requestAccessToken(code: string): Promise<string | HttpException> {
    const result = await axios.post(this.ConfigService.get("GET_ACCESS_TOKEN_URL"), {
      code: "code",
      client_id: this.clientId,
      client_secret: this.clientSecret
    });
    const accessToken = new URLSearchParams(result.data).get("access_token");

    if (accessToken) {
      return accessToken;
    } else {
      throw new HttpException("Bad verification code", HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserDataByAccessToken(githubAccessToken: string): Promise<BaseUser> {
    const { data } = await axios.get(this.ConfigService.get("GITHUB_API_AUTHENTICATED_USER"), {
      headers: {
        "Authorization": `token ${githubAccessToken}`
      }
    });

    const user: BaseUser = {
      id: data.login,
      github_id: data.id,
      avatar_url: data.avatar_url,
      name: data.name,
      github_access_token: githubAccessToken
    };

    return user;
  }

  async getRepsWithUserActivity(username: string) {
    const githubApiUserEventsUrl = generateUrl(this.ConfigService.get("GITHUB_API_USER_EVENTS"), {
      USERNAME: username
    });

    const { data } = await axios(githubApiUserEventsUrl);

    const repsIdObjMap: Record<number, Rep> = [];

    for (const { repo: { id: repGithubId, name: repName } } of data) {
      const repUrl = generateUrl(this.ConfigService.get("GITHUB_REPOSITORY_URL"), {
        REPO_FULL_NAME: repName
      });

      if (!repsIdObjMap[repGithubId]) {
        repsIdObjMap[repGithubId] = (this.EntityManager.create(Rep, {
          name: repName,
          github_id: repGithubId,
          url: repUrl
        }));
      }
    }

    return Object.values(repsIdObjMap);
  }

  async getRepEvents(repoFullName: string) {
    const githubApiRepoEvents = generateUrl(this.ConfigService.get("GITHUB_API_REPO_EVENTS"), {
      REPO_FULL_NAME: repoFullName
    });
    const { data } = await axios(githubApiRepoEvents);

    return data;
  }
}
