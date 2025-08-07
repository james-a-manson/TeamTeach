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
exports.ApplicationController = void 0;
const data_source_1 = require("../data-source");
const Application_1 = require("../entity/Application");
const Course_1 = require("../entity/Course");
const Candidate_1 = require("../entity/Candidate");
class ApplicationController {
    constructor() {
        this.applicationRepository = data_source_1.AppDataSource.getRepository(Application_1.Application);
        this.candidateRepository = data_source_1.AppDataSource.getRepository(Candidate_1.Candidate);
        this.courseRepository = data_source_1.AppDataSource.getRepository(Course_1.Course);
    }
    // Get all applications in db
    getAllApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all the applications with their relations (makes things easier in future)
                const applications = yield this.applicationRepository.find({
                    relations: ["candidate", "course"]
                });
                // Return the applications as JSON
                return res.json(applications);
            }
            catch (error) {
                // Returns an error message if something goes wrong
                console.error("Error retrieving applications:", error);
                return res.status(500).json({ message: "Error retrieving applications", error });
            }
        });
    }
    // Get a specific application by ID
    getApplicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                // Find the corresponding application by ID
                const application = yield this.applicationRepository.findOne({
                    where: { applicationId: parseInt(applicationId) },
                    relations: ["candidate", "course"]
                });
                // If application not found, return 404
                if (!application) {
                    return res.status(404).json({ message: "Application not found" });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Error retrieving application", error });
            }
        });
    }
    // Create a new application
    createApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // All the required fields for creating an application
                const { candidateEmail, courseCode, roleType, availability, skills, previousRoles, academicCredentials, } = req.body;
                // Check that the the application has all the required fields (400 is a bad request)
                if (!candidateEmail || !availability || !roleType || !courseCode || !skills || !academicCredentials) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                // Check that the user exists
                const candidate = yield this.candidateRepository.findOne({ where: { email: candidateEmail } });
                // If the user does not exist, return 404
                if (!candidate) {
                    return res.status(404).json({ message: "Candidate not found" });
                }
                // We need to check that the course exists
                const course = yield this.courseRepository.findOne({ where: { courseCode } });
                // If the course does not exist, return 404
                if (!course) {
                    return res.status(404).json({ message: "Course not found" });
                }
                // Now we need to check if there is an existing application for the candidate in this role in the course
                const existingApplication = yield this.applicationRepository.findOne({
                    where: {
                        candidateEmail,
                        courseCode,
                        roleType
                    }
                });
                // If there is an existing application, return 409 (409 means theres a conflict with the current state of the resource)
                if (existingApplication) {
                    return res.status(409).json({ message: "Application already exists for this candidate in this role for the course" });
                }
                // If it has passed all checks, we can create the application
                const newApplication = this.applicationRepository.create({
                    roleType,
                    status: "pending",
                    availability,
                    skills,
                    previousRoles: previousRoles || "", // Optional field, can be empty
                    academicCredentials,
                    lecturerComments: "", // Default to empty string
                    rankedBy: "", // Default to empty string
                    candidateEmail,
                    courseCode
                });
                yield this.applicationRepository.save(newApplication);
                // Return the new application
                const savedApplication = yield this.applicationRepository.findOne({
                    where: { applicationId: newApplication.applicationId },
                    relations: ["candidate", "course"]
                });
                return res.status(201).json(savedApplication);
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating application", error });
            }
        });
    }
    // Get applications by user email or course code
    getApplicationsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                // Check that candidate exists
                const candidate = yield this.candidateRepository.findOne({ where: { email } });
                // If the user does not exist, return 404
                if (!candidate) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Find all applications for the user
                const applications = yield this.applicationRepository.find({
                    where: { candidateEmail: email },
                    relations: ["candidate", "course"]
                });
                // We don't need to return an error if the user has no applications, just return an empty array
                res.json(applications);
            }
            catch (error) {
                res.status(500).json({ message: "Error retrieving applications", error });
            }
        });
    }
    getApplicationsByCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.params;
                // Check that course exists
                const course = yield this.courseRepository.findOne({ where: { courseCode: code } });
                // If the course does not exist, return 404
                if (!course) {
                    return res.status(404).json({ message: "Course not found" });
                }
                // Find all applications for the course
                const applications = yield this.applicationRepository.find({
                    where: { courseCode: code },
                    relations: ["candidate", "course"]
                });
                // We don't need to return an error if the course has no applications, just return an empty array
                res.json(applications);
            }
            catch (error) {
                res.status(500).json({ message: "Error retrieving applications", error });
            }
        });
    }
    // Update an application's status
    updateApplicationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                const { status } = req.body;
                // First we have to ensure that a valid status is provided
                const validStatuses = ["pending", "accepted", "rejected"];
                // If an invalid status is provided, we return a 400 error (bad request)
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({ message: "Invalid status provided" });
                }
                // Now we need to find the application by ID
                const application = yield this.applicationRepository.findOne({
                    where: { applicationId: parseInt(applicationId) },
                    relations: ["candidater", "course"]
                });
                // If the application does not exist, return 404
                if (!application) {
                    return res.status(404).json({ message: "Application not found" });
                }
                application.status = status;
                // If the status is accepted, we need to update the number of timesAccepted for the candidate
                if (status === "accepted") {
                    const candidate = yield this.candidateRepository.findOne({ where: { email: application.candidateEmail } });
                    // If the user does not exist, return 404
                    if (!candidate) {
                        return res.status(404).json({ message: "Candidate not found" });
                    }
                    // Increment the timesAccepted count
                    candidate.timesAccepted += 1;
                    yield this.candidateRepository.save(candidate);
                }
                // Save the updated application
                const updatedApplication = yield this.applicationRepository.save(application);
                // Return the updated application
                return res.json(updatedApplication);
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating application status", error });
            }
        });
    }
    // Update application feedback (comments from lecturers)
    updateApplicationFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                const { feedback, rankedBy } = req.body;
                // Get relevant application
                const application = yield this.applicationRepository.findOne({
                    where: { applicationId: parseInt(applicationId) },
                    relations: ["candidate", "course"]
                });
                // If the application does not exist, return 404
                if (!application) {
                    return res.status(404).json({ message: "Application not found" });
                }
                // We want to add lecturer comments and rankedBy information if it was provided
                if (feedback) {
                    // We want to append the feedback to the existing lecturer comments, not overwrite it
                    const existingComments = application.lecturerComments ? application.lecturerComments : "";
                    application.lecturerComments = `${existingComments}\n${feedback}`;
                    const existingRankedBy = application.rankedBy ? application.rankedBy : "";
                    application.rankedBy = `${existingRankedBy}\n${rankedBy}`;
                }
                // Save the updated application
                const updatedApplication = yield this.applicationRepository.save(application);
                // Return the updated application
                return res.json(updatedApplication);
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating application feedback", error });
            }
        });
    }
    deleteApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                // Find the application by ID
                const application = yield this.applicationRepository.findOne({
                    where: { applicationId: parseInt(applicationId) }
                });
                // If the application does not exist, return 404
                if (!application) {
                    return res.status(404).json({ message: "Application not found" });
                }
                // Delete the application
                yield this.applicationRepository.remove(application);
                // Return a success message
                return res.json({ message: "Application deleted successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error deleting application", error });
            }
        });
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=ApplicationController.js.map