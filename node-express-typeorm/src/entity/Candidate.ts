import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { Application } from "./Application";

@Entity("candidates")
export class Candidate {
  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn({ name: 'date_created' })
  dateCreated: Date;

  @Column({ default: 0 })
  timesAccepted: number;

  @Column({ default: 0 })
  ratingSum: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: false })
  isBlocked: boolean;

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];
}
