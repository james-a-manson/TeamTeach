import Router from "express";
import { CandidateController } from "../controller/CandidateController";

const router = Router();
const candidateController = new CandidateController();

// Route to get all candidates
router.get("/candidates", async (req, res) => {
  await candidateController.getAllCandidates(req, res);
});

// Route to get a candidate by email
router.get("/candidates/:email", async (req, res) => {
  await candidateController.getCandidateByEmail(req, res);
});

// save a user to the db
router.post("/candidates", async (req, res) => {
  candidateController.save(req, res);
});

// update the rating of a user
router.put("/candidates/:email/:newRating", async (req, res) => {
  candidateController.updateRating(req, res);
});

// update the times accepted of a user
router.put("/candidates/accept/:email/:applicationId", async (req, res) => {
  candidateController.applicationAccepted(req, res);
});

// get statistics
router.get("/statistics", async (req, res) => {
  candidateController.getStatistics(req, res);
});

export default router;
