import express from 'express';
import { getAllUsers, markTopReporters, getAllIncidents, getLatestIncidents, getAdminStats, uploadIncidentAsAdmin,getIncidentsByState ,deleteUser  } from '../controllers/adminController.js';
import requireAuth from '../middleware/requireAuth.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

router.use(requireAuth);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.patch('/top-reporters', markTopReporters);
router.get('/incidents', getAllIncidents);
router.get('/latest-incidents', getLatestIncidents);
router.get('/stats', getAdminStats);
router.post('/upload-incident', uploadIncidentAsAdmin);
router.delete('/users/:userId', deleteUser);

export default router;