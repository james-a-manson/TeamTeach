import "reflect-metadata";
import { DataSource } from "typeorm";
import { Application } from "./entity/Application";
import { Candidate } from "./entity/Candidate";
import { Course } from "./entity/Course";
import { Lecturer } from "./entity/Lecturer";

import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [Application, Candidate, Course, Lecturer],
  migrations: [],
  subscribers: [],
});
