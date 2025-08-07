import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Course } from "./Course";
import { Candidate } from "./Candidate";

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn()
    applicationId: number;

    @Column()
    roleType: string;

    @Column()
    status: string;

    @CreateDateColumn()
    applicationDate: Date;

    @Column()
    availability: string;

    @Column()
    skills: string;

    @Column()
    previousRoles: string;

    @Column()
    academicCredentials: string;

    @Column()
    lecturerComments: string;

    @Column()
    rankedBy: string;

    @Column()
    candidateEmail: string;

    @Column()
    courseCode: string;

    @ManyToOne(() => Candidate, candidate => candidate.applications)
    @JoinColumn({ name: 'candidateEmail'})
    candidate: Candidate;

    @ManyToOne(() => Course, course => course.applications)
    @JoinColumn({ name: 'courseCode' })
    course: Course;
}

