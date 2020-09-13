import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryColumn, OneToMany
} from "typeorm";
import { Rep } from "./rep.entity";
import { UserEvent } from "./user_events.entity";
import { RepUser } from "./rep_user.entity";

@Entity("users")
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: "bigint", unique: true })
  github_id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  github_access_token: string;

  @Column({ nullable: true })
  access_token: string;

  @Column({
    unique: true,
    length: 2000
  })
  profile_url: string;

  @Column({
    unique: true,
    nullable: true,
    length: 2000
  })
  avatar_url: string;

  @OneToMany(type => RepUser, repUser => repUser.user)
  repsUsers: RepUser[];

  @OneToMany(type => UserEvent, userEvent => userEvent.user)
  userEvents: UserEvent[];

  @ManyToMany(type => Rep, rep => rep.users, {
    eager: true
  })
  @JoinTable({
    name: "reps_users",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "rep_id",
      referencedColumnName: "id"
    }
  })
  reps: Rep[];
}
