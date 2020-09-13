import { Request, Body, Controller, Post, UseGuards, Get, Res } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private EntityManager: EntityManager, private AuthService: AuthService) {
  }

  @Get('/check')
  @UseGuards(AuthGuard("jwt"))
  checkUserByAccessToken(@Res() res) {
    res.send('OK');
  }
}
