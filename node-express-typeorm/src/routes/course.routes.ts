import { Router } from "express";
import { CoursesController } from "../controller/CoursesController";

const router = Router();
const coursesController = new CoursesController();

router.get("/courses", async (req, res) => {
    await coursesController.all(req, res);
})

router.get("/courses/:courseCode", async (req, res) => {
    await coursesController.getCourseByID(req, res);
})

router.put("/courses", async (req, res) => {
    await coursesController.addCourse(req, res)
})

export default router;