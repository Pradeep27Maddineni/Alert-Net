import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { uploadIncident, helpIncident,getIncidentById,getMyIncidents } from '../controllers/incidentController.js';


export default function(io) {
  const router = express.Router();
  router.post('/upload', requireAuth, uploadIncident(io));
  router.post('/help/:incidentId', requireAuth, helpIncident(io));
  router.get('/my-incidents',requireAuth,getMyIncidents)
  router.get('/:id', requireAuth, getIncidentById);
  return router;
}
