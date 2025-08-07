import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Lecturer } from "../entity/Lecturer";
import { Course } from "../entity/Course";

export class LecturerController {
    private lecturerRepository = AppDataSource.getRepository(Lecturer);
    private courseRepository = AppDataSource.getRepository(Course);

    // Get all lecturers
    async getAllLecturers(req: Request, res: Response) {
        try {
            // Handy to have the course information along with the lecturers
            const lecturers = await this.lecturerRepository.find({
                relations: ["courses"]
            });
            
            return res.json(lecturers);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving lecturers', error });
        }
    }

    // Get lecturer by email
    async getLecturerByEmail(req: Request, res: Response) {
        try {
            const { email } = req.params;
            const lecturer = await this.lecturerRepository.findOne({
                where: { email },
                relations: ["courses"]
            });

            // If the lecturer doesn't exist, return a 404 error
            if (!lecturer) {
                return res.status(404).json({ message: 'Lecturer not found' });
            }

            return res.json(lecturer);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving lecturer', error });
        }
    }
}