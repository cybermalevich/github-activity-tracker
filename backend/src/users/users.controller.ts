import { Body, Request, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { EntityManager } from "typeorm";
import { User } from "../entities/user.entity";
import { UserEvent } from "../entities/user_events.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UsersController {
  constructor(private UsersService: UsersService, private EntityManager: EntityManager) {
  }

  @UseGuards(AuthGuard("jwt"))
  @Get('/')
  async getUser(@Request() req) {
    const user = req.user;

    return await this.EntityManager.findOne(User, user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/reps")
  async getRepsWithUserActivity(@Request() req) {
    const userId = req.user.id;
    const user = await this.EntityManager.findOne(User, {
      where: {
        id: userId
      }
    });

    return user.reps;
  }
}
