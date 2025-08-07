import { Entity, PrimaryColumn, Column, ManyToMany, CreateDateColumn, JoinTable } from 'typeorm';
import { Course } from './Course'

@Entity("lecturers")
export class Lecturer {
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

    @Column()
    assignedCourseCodes: string;

    @CreateDateColumn({ name: 'date_created' })
    dateCreated: Date;

    @ManyToMany(() => Course, course => course.courseLecturers)
    @JoinTable({
        name: 'course_lecturers',
        joinColumn: {
            name: 'lecturerEmail',
            referencedColumnName: 'email'
        },
        inverseJoinColumn: {
            name: 'courseCode',
            referencedColumnName: 'courseCode'
        }
    })
    courses: Course[];
}
