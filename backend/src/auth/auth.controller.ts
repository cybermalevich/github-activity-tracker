import { Request, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private EntityManager: EntityManager, private AuthService: AuthService) {
  }

  @Post("test")
  @UseGuards(AuthGuard('jwt'))
  async test(@Request() req) {
    return req.user;
  }
}
