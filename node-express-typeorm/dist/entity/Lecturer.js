"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecturer = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("./Course");
let Lecturer = class Lecturer {
};
exports.Lecturer = Lecturer;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Lecturer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Lecturer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Lecturer.prototype, "salt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Lecturer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Lecturer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Lecturer.prototype, "assignedCourseCodes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_created' }),
    __metadata("design:type", Date)
], Lecturer.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Course_1.Course, course => course.courseLecturers),
    (0, typeorm_1.JoinTable)({
        name: 'course_lecturers',
        joinColumn: {
            name: 'lecturerEmail',
            referencedColumnName: 'email'
        },
        inverseJoinColumn: {
            name: 'courseCode',
            referencedColumnName: 'courseCode'
        }
    }),
    __metadata("design:type", Array)
], Lecturer.prototype, "courses", void 0);
exports.Lecturer = Lecturer = __decorate([
    (0, typeorm_1.Entity)("lecturers")
], Lecturer);
//# sourceMappingURL=Lecturer.js.map