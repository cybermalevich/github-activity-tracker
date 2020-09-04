import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryColumn, JoinColumn, OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { Rep } from "./rep.entity";
import { UserEvent } from "./user_events.entity";

@Entity("users")
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: "bigint", unique: true })
  github_id: number;

  @Column()
  name: string;

  @Column()
  access_token: string;

  @Column()
  github_access_token: string;

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

  @OneToMany(type => UserEvent, userEvent => userEvent.user, {
    eager: true,
  })
  userEvents: UserEvent[];

  @ManyToMany(type => Rep, rep => rep.users, {
    eager: true,
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
