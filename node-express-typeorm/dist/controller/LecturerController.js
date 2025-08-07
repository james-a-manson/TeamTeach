"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerController = void 0;
const data_source_1 = require("../data-source");
const Lecturer_1 = require("../entity/Lecturer");
const Course_1 = require("../entity/Course");
class LecturerController {
    constructor() {
        this.lecturerRepository = data_source_1.AppDataSource.getRepository(Lecturer_1.Lecturer);
        this.courseRepository = data_source_1.AppDataSource.getRepository(Course_1.Course);
    }
    // Get all lecturers
    getAllLecturers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Handy to have the course information along with the lecturers
                const lecturers = yield this.lecturerRepository.find({
                    relations: ["courses"]
                });
                return res.json(lecturers);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error retrieving lecturers', error });
            }
        });
    }
    // Get lecturer by email
    getLecturerByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const lecturer = yield this.lecturerRepository.findOne({
                    where: { email },
                    relations: ["courses"]
                });
                // If the lecturer doesn't exist, return a 404 error
                if (!lecturer) {
                    return res.status(404).json({ message: 'Lecturer not found' });
                }
                return res.json(lecturer);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error retrieving lecturer', error });
            }
        });
    }
}
exports.LecturerController = LecturerController;
//# sourceMappingURL=LecturerController.js.map