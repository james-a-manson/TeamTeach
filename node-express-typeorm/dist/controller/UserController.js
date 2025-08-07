"use strict";
/* import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);


  // get all users
  async all(request: Request, response: Response) {
    const users = await this.userRepository.find();
    return response.json(users);
  }

  // get one user by email
  async one(request: Request, response: Response) {
    const emailParam = request.params.email;
    const user = await this.userRepository.findOne({
      where: { email: emailParam }
    });
    return response.json(user);
  }

  // create new user in db
  async save(request: Request, response: Response) {
    const { email, password, role, firstName, lastName } = request.body;

    console.log(email);

    const user = Object.assign(new User(), {
      email,
      password,
      role,
      firstName,
      lastName
    });


    try {
      // ensure all fields are not null
      if (!email || !password || !role || !firstName || !lastName) {
        return response.json(400).json({ message: "Missing required fields!" });
      }


      // check whether user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: email }
      });

      if (existingUser) {
        return response.status(409).json({ message: "This user already exists!" });
      }

      const savedUser = await this.userRepository.save(user);
      return response.status(201).json(savedUser);

    } catch (error) {
      return response.status(400).json({ message: "Error creating user", error: error });
    }
  }

  async updateRating(request: Request, response: Response) {
    const { email, newScore } = request.body;

    // ensure all fields are not null
    if (!email || !newScore) {
      return response.status(400).json({ message: "Missing required fields!" });
    }

    const foundUser = await this.userRepository.findOne({
      where: { email: email }
    });

    // check if user exists
    if (!foundUser) {
      return response.status(404).json({ message: "User not found!" });
    }

    const password = foundUser.password;
    const role = foundUser.role;
    const firstName = foundUser.firstName;
    const lastName = foundUser.lastName;
    const isBlocked = foundUser.isBlocked;

    // calculate new score
    const ratingSum = foundUser.ratingSum + newScore;
    const timesAccepted = foundUser.timesAccepted + 1;
    const rating = ratingSum / timesAccepted;

    let userToUpdate = Object.assign(foundUser, {
      email,
      password,
      role,
      firstName,
      lastName,
      timesAccepted,
      ratingSum,
      rating,
    });

    try {
      const updatedUser = await this.userRepository.save(userToUpdate);

      return response.json({ updatedUser });

    } catch (error) {
      return response.status(400).json({ message: "Error updating rating" })
    }


  }

}
*/ 
//# sourceMappingURL=UserController.js.map