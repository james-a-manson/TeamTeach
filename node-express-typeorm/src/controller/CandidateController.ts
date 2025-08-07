import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Candidate } from "../entity/Candidate";
import { Application } from "../entity/Application";

export class CandidateController {
  private candidateRepository = AppDataSource.getRepository(Candidate);
  private applicationRepository = AppDataSource.getRepository(Application);

  // Get all candidates
  async getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = await this.candidateRepository.find({
        relations: ["applications"],
      });
      return res.json(candidates);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving candidates", error });
    }
  }

  async getCandidateByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      // Find candidate by email
      const candidate = await this.candidateRepository.findOne({
        where: { email },
        relations: ["applications"],
      });

      // If they don't exist, return a 404 error
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      return res.json(candidate);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving candidate", error });
    }
  }

  // add a new candidate to the db
  async save(request: Request, response: Response) {
    const { email, password, firstName, lastName } = request.body;

    console.log(email);

    // THIS IS FOR TESTING REMOVE THIS LATER
    const salt = "";

    const user = Object.assign(new Candidate(), {
      email,
      password,
      salt,
      firstName,
      lastName,
    });

    try {
      // ensure all fields are not null
      if (!email || !password || !firstName || !lastName) {
        return response
          .status(400)
          .json({ message: "Missing required fields!" });
      }

      // check whether user already exists
      const existingUser = await this.candidateRepository.findOne({
        where: { email: email },
      });

      if (existingUser) {
        return response
          .status(409)
          .json({ message: "This user already exists!" });
      }

      const savedUser = await this.candidateRepository.save(user);
      return response.status(201).json(savedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating candidate", error: error });
    }
  }

  async updateRating(request: Request, response: Response) {
    const { email, newRating } = request.params;

    // ensure all fields are not null
    if (!email || newRating == null) {
      return response.status(400).json({ message: "Missing required fields!" });
    }
    try {
      const foundCandidate = await this.candidateRepository.findOne({
        where: { email: email },
      });

      if (!foundCandidate) {
        return response.status(404).json({ message: "Candidate not found!" });
      }

      console.log(foundCandidate.ratingSum);
      console.log(foundCandidate.rating);

      foundCandidate.ratingSum += Number(newRating);
      foundCandidate.rating =
        foundCandidate.ratingSum / foundCandidate.timesAccepted;

      const updatedUser = await this.candidateRepository.save(foundCandidate);

      return response.json({ updatedUser });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating rating", error });
    }
  }

  async applicationAccepted(req: Request, res: Response) {
    const { email, applicationId } = req.params;

    // We need to make sure that the email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // We need to make sure that the applicationId is provided and a number
    if (!applicationId || isNaN(Number(applicationId))) {
      return res
        .status(400)
        .json({ message: "Valid application ID is required" });
    }

    try {
      // Find the application and then find the user based on the application
      const application = await this.applicationRepository.findOne({
        where: { applicationId: Number(applicationId) },
        relations: ["candidate", "course"],
      });

      // If the application doesn't exist return a 404 error
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (application.candidate.email !== email) {
        return res.status(400).json({
          message: "Application does not belong to this candidate",
        });
      }

      if (application.status != "pending") {
        return res.status(400).json({
          message: "Application is not in pending status",
        });
      }

      application.status = "accepted";

      const candidate = application.candidate;
      candidate.timesAccepted += 1;

      const updatedCandidate = await this.candidateRepository.save(candidate);
      const updatedApplication = await this.applicationRepository.save(
        application
      );

      return res.json({
        message: "Application accepted successfully",
        updatedCandidate,
        updatedApplication,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating candidate", error });
    }
  }

  async getStatistics(req: Request, res: Response) {
    try {
      // First we want to get all the candidates
      const candidates = await this.candidateRepository.find({
        relations: ["applications"],
      });

      // If there are no candidates, we can return no statistics
      if (candidates.length === 0) {
        return res.json({
          mostChosen: null,
          leastChosen: null,
          notChosen: [],
          allCandidates: [],
        });
      }

      // Now we want to find the most and least chosen candidate
      let mostChosen: Candidate | null = null;
      let leastChosen: Candidate | null = null;

      mostChosen = candidates.reduce((prev, current) => {
        return prev.timesAccepted > current.timesAccepted ? prev : current;
      });

      leastChosen = candidates.reduce((prev, current) => {
        return prev.timesAccepted < current.timesAccepted ? prev : current;
      });

      // Now we want to find the candidates that were not chosen at all
      const notChosen = candidates.filter(
        (candidate) => candidate.timesAccepted === 0
      );

      // Return the statistics
      return res.json({
        mostChosen,
        leastChosen,
        notChosen,
        allCandidates: candidates,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving statistics", error });
    }
  }
}
