import { Controller, Request, Get, Param, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { RepUser } from "../entities/rep_user.entity";
import { AuthGuard } from "@nestjs/passport";
import { Rep } from "../entities/rep.entity";
import { UserEvent } from "../entities/user_events.entity";

@Controller("reps")
export class RepsController {
  constructor(private EntityManager: EntityManager) {
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id/users")
  async getUsersFromRep(@Param("id") repId, @Request() req) {
    const rep = await this.EntityManager.findOne(Rep, {
      where: {
        id: repId
      }
    });
    const { name: repName } = rep;
    const userPresenceInRep = await this.EntityManager.findOne(RepUser, {
      where: {
        user_id: req.user.id,
        rep_id: repId
      }
    }) !== undefined;

    if (!userPresenceInRep) {
      throw new HttpException(`User is not present in the rep with id ${repId}`, HttpStatus.FORBIDDEN);
    }

    const users = await this.EntityManager.createQueryBuilder(RepUser, "rep_user")
      .select(["id", "github_id", "name", "profile_url", "avatar_url"])
      .innerJoin("rep_user.user", "")
      .where("rep_user.rep_id = (:rep_id)", { rep_id: repId })
      .getRawMany();

    return {
      rep_name: repName,
      users
    };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/:repId/user/:userId/activity")
  async getUserActivity(@Request() req, @Param("repId") repId, @Param("userId") userId) {
    const rep = await this.EntityManager.findOne(Rep, {
      where: {
        id: repId
      }
    });

    const events = await this.EntityManager.find(UserEvent, {
      where: {
        user_id: userId,
        rep_id: repId
      }
    });

    return {
      rep_name: rep.name,
      events
    };
  }
}
