import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { CreationalJobsService } from "./creational-jobs.service";
import { GithubDataFetchingService } from "../github-data-fetching/github-data-fetching.service";

@Controller()
export class CreationalJobsController {
  constructor(
    private GithubDataFetchingService: GithubDataFetchingService,
    private CreationalJobsService: CreationalJobsService
  ) {
  }

  @Get("after_auth")
  async after_auth(@Query("code") code, @Res() res: Response) {
    const accessToken = await this.GithubDataFetchingService.requestAccessToken(code);
    await this.CreationalJobsService.fetchAndSaveGithubUserData(accessToken);
    res.cookie("access_token", accessToken);

    res.sendStatus(200);
  }
}
