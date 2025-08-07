import bcrypt from 'bcrypt';

import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Candidate } from '../entity/Candidate';
import { Lecturer } from '../entity/Lecturer';

export class AuthenticationController {
    private candidateRepository = AppDataSource.getRepository(Candidate);
    private lecturerRepository = AppDataSource.getRepository(Lecturer);

    // Register a new candidate
    async registerCandidate(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName } = req.body;

            // First we need to ensure all required output has been provided
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // First we need to check if the email is already registered as a candidate or lecturer
            const existingCandidate = await this.candidateRepository.findOneBy({ email });
            const existingLecturer = await this.lecturerRepository.findOneBy({ email });

            if (existingCandidate || existingLecturer) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            // Then we need to validate the email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Then we need to perform a strong password check (using microsoft's password strength guidelines)
            // Password length
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }

            // Uppercase letter check
            if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
            }

            // Lowercase letter check
            if (!/[a-z]/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
            }

            // Number check
            if (!/\d/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one number' });
            }

            // Special character check
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one special character' });
            }

            // If the password is valid, we need to hash it and store the salt using bcrypt

            const saltRounds = 10; // Good midpoint between performance and security

            // salt and hashed password generation
            const salt = await bcrypt.genSalt(saltRounds);

            const hashedPassword = await bcrypt.hash(password, salt);

            // Initiating new candidate
            const newCandidate = this.candidateRepository.create({
                email,
                password: hashedPassword,
                salt: salt,
                firstName,
                lastName,
                dateCreated: new Date(),
                timesAccepted: 0,
                ratingSum: 0,
                rating: 0,
                isBlocked: false
            });

            const savedCandidate = await this.candidateRepository.save(newCandidate);

            // Excluding the sensitive fields from the return value
            const { password: _, salt: __, ...candidateResponse } = savedCandidate; 
            return res.status(201).json({ message: 'Candidate registered successfully', candidate: candidateResponse });

        } catch (error) {
            return res.status(500).json({ message: 'Error creating account', error });
        }
    }

    async registerLecturer(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName } = req.body;

            // First we need to ensure all required output has been provided
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // First we need to check if the email is already registered as a candidate or lecturer
            const existingCandidate = await this.candidateRepository.findOneBy({ email });
            const existingLecturer = await this.lecturerRepository.findOneBy({ email });

            if (existingCandidate || existingLecturer) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            // Then we need to validate the email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Then we need to perform a strong password check (using microsoft's password strength guidelines)
            // Password length
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }

            // Uppercase letter check
            if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
            }

            // Lowercase letter check
            if (!/[a-z]/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
            }

            // Number check
            if (!/\d/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one number' });
            }

            // Special character check
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                return res.status(400).json({ message: 'Password must contain at least one special character' });
            }

            // If the password is valid, we need to hash it and store the salt using bcrypt

            const saltRounds = 10; // Good midpoint between performance and security

            // salt and hashed password generation
            const salt = await bcrypt.genSalt(saltRounds);

            const hashedPassword = await bcrypt.hash(password, salt);

            // Initiating new lecturerW
            const newLecturer = this.lecturerRepository.create({
                email,
                password: hashedPassword,
                salt: salt,
                firstName,
                lastName,
                assignedCourseCodes: '',
                dateCreated: new Date()
            });

            const savedLecturer = await this.lecturerRepository.save(newLecturer);

            // Excluding the sensitive fields from the return value
            const { password: _, salt: __, ...lecturerResponse } = savedLecturer;

            return res.status(201).json({ message: 'Lecturer registered successfully', lecturer: lecturerResponse });

        } catch (error) {
            return res.status(500).json({ message: 'Error creating account', error });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // We need to make sure that login details are provided
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const candidate = await this.candidateRepository.findOneBy({ email });
            const lecturer = await this.lecturerRepository.findOneBy({ email });

            // Now we determine if the user is a candidate or a lecturer
            const user = candidate ? candidate : lecturer;

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // We need to check if the password matches the stored hash
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Now we need to exclude sensitive information from the response
            const { password: _, salt: __, ...userResponse } = user;
            const responseWithRole = {
                ...userResponse,
                role: candidate ? 'candidate' : 'lecturer'
            };
            return res.status(200).json({ message: 'Login successful', user: responseWithRole });

        } catch (error) {
            return res.status(500).json({ message: 'Error logging in', error });
        }
    }
}