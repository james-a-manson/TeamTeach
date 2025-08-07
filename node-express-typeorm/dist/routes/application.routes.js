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
const ApplicationController_1 = require("../controller/ApplicationController");
const router = (0, express_1.default)();
const applicationController = new ApplicationController_1.ApplicationController();
// Route to get all applications
router.get('/applications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.getAllApplications(req, res);
}));
// Route to get a specific application by ID
router.get('/applications/:applicationId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.getApplicationById(req, res);
}));
// Route to get applications by course code
router.get('/applications/course/:courseCode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.getApplicationsByCourse(req, res);
}));
// Route to get applications by candidate email
router.get('/applications/candidate/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.getApplicationsByUser(req, res);
}));
// Route to create a new application
router.post('/applications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.createApplication(req, res);
}));
// Route to update application status
router.put('/applications/:applicationId/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.updateApplicationStatus(req, res);
}));
// Route to update application feedback
router.put('/applications/:applicationId/feedback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.updateApplicationFeedback(req, res);
}));
// Route to delete an application
router.delete('/applications/:applicationId/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield applicationController.deleteApplication(req, res);
}));
exports.default = router;
//# sourceMappingURL=application.routes.js.map