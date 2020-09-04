import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { UserEvent } from "./user_events.entity";
import { User } from "./user.entity";

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

  @OneToMany(type => UserEvent, userEvent => userEvent.rep)
  userEvents: UserEvent[];

  @ManyToMany(type => User, user => user.reps)
  users: User[];
}
