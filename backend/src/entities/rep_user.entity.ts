import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Rep } from "./rep.entity";

@Entity("reps_users")
export class RepUser {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  rep_id: number;

  @ManyToOne(type => Rep, rep => rep.repsUsers)
  @JoinColumn({
    name: 'rep_id'
  })
  rep: Rep;

  @ManyToOne(type => User, user => user.repsUsers)
  @JoinColumn({
    name: 'user_id'
  })
  user: User;
}
