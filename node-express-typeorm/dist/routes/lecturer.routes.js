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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LecturerController_1 = require("../controller/LecturerController");
const router = (0, express_1.default)();
const lecturerController = new LecturerController_1.LecturerController();
// Route to get all lecturers
router.get('/lecturers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield lecturerController.getAllLecturers(req, res);
}));
// Route to get a lecturer by email
router.get('/lecturers/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield lecturerController.getLecturerByEmail(req, res);
}));
exports.default = router;
//# sourceMappingURL=lecturer.routes.js.map