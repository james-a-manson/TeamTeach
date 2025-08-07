"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Application_1 = require("./entity/Application");
const Candidate_1 = require("./entity/Candidate");
const Course_1 = require("./entity/Course");
const Lecturer_1 = require("./entity/Lecturer");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
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
    entities: [Application_1.Application, Candidate_1.Candidate, Course_1.Course, Lecturer_1.Lecturer],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map