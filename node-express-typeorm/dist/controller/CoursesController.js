"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesController = void 0;
const data_source_1 = require("../data-source");
const Course_1 = require("../entity/Course");
class CoursesController {
    constructor() {
        this.courseRepository = data_source_1.AppDataSource.getRepository(Course_1.Course);
    }
}
exports.CoursesController = CoursesController;
//# sourceMappingURL=CoursesController.js.map