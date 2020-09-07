import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { GithubAuthService } from "./github-auth.service";
import { User } from "../entities/user.entity";

@Controller("github-auth")
export class GithubAuthController {
  constructor(private GithubAuthService: GithubAuthService) {
  }

  @Get("after_auth")
  async after_auth(@Query("code") code, @Res() res: Response) {
    const accessToken = await this.GithubAuthService.requestAccessToken(code);
    const user = await this.GithubAuthService.saveUser(accessToken);

    if (user instanceof User) {
      res.cookie('access_token', user.access_token);
      const reps = await this.GithubAuthService.populateUserReps(user.id);
      await this.GithubAuthService.populateRepsEvents(reps);
    }

    res.sendStatus(200);
  }
}