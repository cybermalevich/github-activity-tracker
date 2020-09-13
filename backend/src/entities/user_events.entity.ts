import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Rep } from "./rep.entity";
import { User } from "./user.entity";

@Entity("user_events")
export class UserEvent {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "bigint", unique: true })
  github_id: number;

  @Column()
  type: string;

  @Column({ type: "jsonb" })
  payload: string;

  @Column({ type: "timestamp with time zone" })
  created_at: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  rep_id: number;

  @ManyToOne(type => User, user => user.userEvents)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Rep, rep => rep.userEvents)
  @JoinColumn({
    name: "rep_id"
  })
  rep: Rep;
}
