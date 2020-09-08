import { Injectable } from "@nestjs/common";
import { Rep } from "../entities/rep.entity";
import { User } from "../entities/user.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class RepsService {
  constructor(private EntityManager: EntityManager) {
  }

  async populateUserReps(userId: string, reps: Rep[]): Promise<Rep[]> {
    const user = await this.EntityManager.findOne(User, {
      id: userId
    });
    const userReps = user.reps.reduce((acc, el) => {
      acc[el.github_id] = el;
      return acc;
    }, {});
    const userRepsForInsert: Rep[] = [];

    if (reps instanceof Array) {
      for (const rep of reps) {
        if (!userReps[rep.github_id]) {
          rep.userEvents = [];
          userReps[rep.github_id] = rep;
          user.reps.push(userReps[rep.github_id]);
          userRepsForInsert.push(rep);
        }
      }
    }

    await this.EntityManager.save(Rep, userRepsForInsert);
    await this.EntityManager.save(user);

    return userRepsForInsert;
  }
}
