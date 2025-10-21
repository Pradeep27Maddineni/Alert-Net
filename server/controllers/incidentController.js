import Incident from '../models/Incident.js';
import User from '../models/User.js';
import cloudinary from 'cloudinary';
import { sendAndStoreNotification } from './notificationController.js'; // 👈 import it

export const uploadIncident = (io) => async (req, res) => {
  try {
    const { type, description, base64Images, coordinates } = req.body;

    if (!Array.isArray(base64Images) || base64Images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const uploadResults = await Promise.all(
      base64Images.map(img =>
        cloudinary.v2.uploader.upload(img, { folder: 'alertnet_incidents' })
      )
    );

    const imageURLs = uploadResults.map(result => result.secure_url);

    const incident = await Incident.create({
      type,
      description,
      imageURLs,
      location: { type: 'Point', coordinates },
      reporter: req.user.id
    });

    console.log("✅ Incident uploaded by", req.user.id);

    // Fetch reporter for saving notification
    const reporter = await User.findById(req.user.id);

    // Create self notification
    const reporterNotification = {
      message: "You have reported this incident.",
      type: "self-report",
      incidentId: incident._id,
      createdAt: new Date(),
      incidentObj: incident, // for client use
    };

    await sendAndStoreNotification(io, [reporter], reporterNotification);

    // Notify nearby users (within 5km)
    const nearbyUsers = await User.find({
      _id: { $ne: req.user.id },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: 20000,
        },
      },
    });

    const areaNotification = {
      message: "New incident reported near your area!",
      type: "alert",
      incidentId: incident._id,
      createdAt: new Date(),
      incidentObj: incident, // for client use
    };

    await sendAndStoreNotification(io, nearbyUsers, areaNotification);

    res.status(201).json({ message: 'Incident uploaded', incident });
  } catch (err) {
    console.error("❌ Error uploading incident:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    res.status(200).json({ incident });
  } catch (err) {
    console.error("❌ Error fetching incident:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyIncidents = async (req, res) => {
  try {
    const myIncidents = await Incident.find({ reporter: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ incidents: myIncidents });
  } catch (err) {
    console.error("❌ Failed to fetch user's incidents:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const helpIncident = (io) => async (req, res) => {
  const { incidentId } = req.params;
  const userId = req.user.id;

  try {
    const incident = await Incident.findById(incidentId);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    if (!incident.helpedBy.includes(userId)) {
      incident.helpedBy.push(userId);
      await incident.save();

      await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

      io.emit('userHelped', {
        userId,
        incidentId,
        message: `User ${userId} is helping with the incident ${incidentId}`
      });
    }

    res.status(200).json({ message: 'Help registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};