import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Application } from "./Application";
import { Lecturer } from "./Lecturer";

@Entity('courses')
export class Course {
    @PrimaryColumn()
    courseCode: string;

    @Column()
    courseName: string;

    @OneToMany(() => Application, application => application.course)
    applications: Application[];

    @ManyToMany(() => Lecturer, lecturer => lecturer.courses)
    courseLecturers: Lecturer[];
}