import {Controller, Get, HttpCode, HttpException, Param, Query, Res} from '@nestjs/common';
import {Response} from 'express';
import {GithubAuthService} from "./github-auth.service";

@Controller('github-auth')
export class GithubAuthController {
    constructor(private GithubAuthService: GithubAuthService) {
    }

    @Get('after_auth')
    async after_auth(@Query('code') code, @Res() res: Response) {
        const accessToken = await this.GithubAuthService.requestAccessToken(code);

        if (accessToken) {
            const userId = await this.GithubAuthService.saveUser(accessToken);

            if (typeof userId === "string") {
                await this.GithubAuthService.populateUserReps(userId);
            }

            res.send('test');
        } else {
            res.status(403).send('Wrong code');
        }
    }
}