import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";

export class CoursesController {
    private courseRepository = AppDataSource.getRepository(Course);

    async all(request: Request, response: Response) {
        const courses = await this.courseRepository.find();

        if (courses.length == 0) {
            return response.status(404).json({ message: "No courses found" })
        }

        return response.json(courses)
    }

    async getCourseByID(request: Request, response: Response) {
        const { courseCode } = request.params

        try {
            const foundCourse = await this.courseRepository.findOne({
                where: { courseCode: courseCode }
            })

            if (!foundCourse) {
                return response.status(404).json({ message: "Course not found!" })
            }

            return response.json(foundCourse)
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Error fetching course" });
        }
    }

    async addCourse(request: Request, response: Response) {
        const { courseCode, courseName } = request.body

        try {
            const foundCourse = await this.courseRepository.findOne({
                where: { courseCode: courseCode }
            })

            if (foundCourse) {
                return response.status(409).json({ message: "This course already exists!" });
            }

            const course = Object.assign(new Course(), {
                courseCode,
                courseName
            })

            const savedCourse = await this.courseRepository.save(course)
            return response.status(201).json({ message: "Course created!", course })


        } catch (error) {
            return response.status(400).json({ message: "Error creating course", error: error })
        }
    }
}