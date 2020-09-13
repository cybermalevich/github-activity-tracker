import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { CreationalJobsService } from "./creational-jobs.service";
import { GithubDataFetchingService } from "../github-data-fetching/github-data-fetching.service";
import { UsersService } from "../users/users.service";
import { User } from "../entities/user.entity";

@Controller()
export class CreationalJobsController {
  constructor(
    private GithubDataFetchingService: GithubDataFetchingService,
    private CreationalJobsService: CreationalJobsService,
    private UsersService: UsersService
  ) {
  }

  @Get("after_auth")
  async after_auth(@Query("code") code, @Res() res: Response) {
    const githubAccessToken = await this.GithubDataFetchingService.requestAccessToken(code);
    const accessToken = await this.CreationalJobsService.fetchAndSaveGithubUserData(githubAccessToken);

    res.send({
      access_token: accessToken
    });
  }
}
