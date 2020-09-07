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
  @Get("/reps")
  async getRepsWithUserActivity(@Request() req) {
    const userId = req.user.username;
    const user = await this.EntityManager.findOne(User, {
      where: {
        id: userId
      }
    });

    return user.reps;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/activity")
  async getUserActivity(@Request() req) {
    const userId = req.user.username;

    return await this.EntityManager.find(UserEvent, {
      where: {
        user_id: userId
      }
    });
  }
}
