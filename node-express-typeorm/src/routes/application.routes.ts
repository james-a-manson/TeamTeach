import Router from 'express';
import { ApplicationController } from '../controller/ApplicationController';

const router = Router();
const applicationController = new ApplicationController();

// Route to get all applications
router.get('/applications', async (req, res) => {
    await applicationController.getAllApplications(req, res);
});

// Route to get a specific application by ID
router.get('/applications/:applicationId', async (req, res) => {
    await applicationController.getApplicationById(req, res);
});

// Route to get applications by course code
router.get('/applications/course/:courseCode', async (req, res) => {
    await applicationController.getApplicationsByCourse(req, res);
});

// Route to get applications by candidate email
router.get('/applications/candidate/:email', async (req, res) => {
    await applicationController.getApplicationsByUser(req, res);
});

// Route to create a new application
router.post('/applications', async (req, res) => {
    await applicationController.createApplication(req, res);
});

// Route to update application status
router.put('/applications/:applicationId/status', async (req, res) => {
    await applicationController.updateApplicationStatus(req, res);
});

// Route to update application feedback
router.put('/applications/:applicationId/feedback', async (req, res) => {
    await applicationController.updateApplicationFeedback(req, res);
});

// Route to delete an application
router.delete('/applications/:applicationId/delete', async (req, res) => {
    await applicationController.deleteApplication(req, res);
});

router.put(`/applications/:applicationId/:rankedBy`, async (req, res) => {
    await applicationController.updateRankedBy(req, res)
})

export default router;