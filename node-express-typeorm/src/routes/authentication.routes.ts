import { Router } from 'express';
import { AuthenticationController } from '../controller/AuthenticationController';

const router = Router();
const authenticationController = new AuthenticationController();

// Login route
router.post('/auth/login', async (req, res) => {
    await authenticationController.login(req, res);
});

// Register route
router.post('/auth/register', async (req, res) => {
    const { role } = req.body;
    if (role === 'candidate') {
        await authenticationController.registerCandidate(req, res);
    }
    else if (role === 'lecturer') {
        await authenticationController.registerLecturer(req, res);
    }
    else {
        res.status(400).json({ message: 'Invalid role specified' });
    }
});

export default router;