import Router from 'express';
import { LecturerController } from '../controller/LecturerController';

const router = Router();
const lecturerController = new LecturerController();

// Route to get all lecturers
router.get('/lecturers', async (req, res) => {
    await lecturerController.getAllLecturers(req, res);
});

// Route to get a lecturer by email
router.get('/lecturers/:email', async (req, res) => {
    await lecturerController.getLecturerByEmail(req, res);
});

export default router;