import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from "typeorm";
import { UserEvent } from "./user_events.entity";
import { User } from "./user.entity";
import { RepUser } from "./rep_user.entity";

@Entity("reps")
export class Rep {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "bigint", unique: true })
  github_id: number;

  @Column()
  name: string;

  @Column({
    length: 2000
  })
  url: string;

  @OneToMany(type => RepUser, repUser => repUser.rep, {
    eager: true
  })
  repsUsers: RepUser[];

  @OneToMany(type => UserEvent, userEvent => userEvent.rep)
  userEvents: UserEvent[];

  @ManyToMany(type => User, user => user.reps)
  users: User[];
}
