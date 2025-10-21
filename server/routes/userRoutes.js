import express from 'express';
import upload from '../middleware/upload.js';
import {
  getUserNotifications,
  deleteUserNotification,
  updateUserProfile,
  getTopReporters
} from '../controllers/userController.js';

import { getIncidentsByState } from '../controllers/adminController.js';

import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();
router.get('/notifications', requireAuth, getUserNotifications);
router.delete('/notifications/:notificationId', requireAuth, deleteUserNotification);
router.get('/top-reporters', getTopReporters);
router.put('/update', requireAuth, upload.single('avatar'), updateUserProfile);
router.get('/by-state', requireAuth,getIncidentsByState); // ✅ New route for admin incident upload

export default router;
