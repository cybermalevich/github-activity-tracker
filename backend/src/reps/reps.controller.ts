import { Controller, Request, Get, Param, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { RepUser } from "../entities/rep_user.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("reps")
export class RepsController {
  constructor(private EntityManager: EntityManager) {
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id/users")
  async getUsersFromRep(@Param("id") repId, @Request() req) {

    const userPresenceInRep = await this.EntityManager.findOne(RepUser, {
      where: {
        user_id: req.user.username,
        rep_id: repId
      }
    }) !== undefined;

    if (!userPresenceInRep) {
      throw new HttpException(`User is not present in the rep with id ${repId}`, HttpStatus.FORBIDDEN);
    }

    return await this.EntityManager.createQueryBuilder(RepUser, "rep_user")
      .select(["user"])
      .where("rep_user.rep_id = (:rep_id)", { rep_id: repId })
      .innerJoin("rep_user.user", "user")
      .getRawMany();
  }
}
