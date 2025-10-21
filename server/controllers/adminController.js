import User from '../models/User.js';
import Incident from '../models/Incident.js';
import cloudinary from 'cloudinary'

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark selected users as top reporters
export const markTopReporters = async (req, res) => {
  try {
    const { topUserIds } = req.body; // array of _id
   // ✅ Replace your current logic with this:
await User.updateMany({}, { $set: { isTopReporter: false } }); // 👈 Explicitly set false
await User.updateMany({ _id: { $in: topUserIds } }, { $set: { isTopReporter: true } });

    res.status(200).json({ message: 'Top reporters updated' });
  } catch (err) {
    console.error("❌ Error updating top reporters:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all incidents
export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().populate('reporter', 'name email');
    res.status(200).json({ incidents });
  } catch (err) {
    console.error("❌ Error fetching incidents:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest 5 incidents (for top incident updates on user side)
export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userCount = await User.countDocuments();
    const incidentCount = await Incident.countDocuments();

    res.status(200).json({
      users: userCount,
      incidents: incidentCount,
    });
  } catch (err) {
    console.error("❌ Admin stats error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLatestIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ incidents });
  } catch (err) {
    console.error("❌ Error fetching latest incidents:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadIncidentAsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { type, description, state, coordinates, base64Images } = req.body;

    if (!type || !description || !state || !coordinates || !base64Images || base64Images.length === 0) {
      return res.status(400).json({ message: 'All fields are required with at least one image' });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      base64Images.map(async (base64) => {
        const result = await cloudinary.v2.uploader.upload(base64, {
          folder: 'alertnet/incidents',
        });
        return result.secure_url;
      })
    );

    const incident = await Incident.create({
      type,
      description,
      state,
      imageURLs: uploadedImages,
      location: {
        type: 'Point',
        coordinates,
      },
      uploadedByAdmin: true,
      status: 'real',
    });

    res.status(201).json({ message: 'Incident uploaded successfully', incident });
  } catch (err) {
    console.error('❌ Admin incident upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc Get incidents filtered by state (case-insensitive)
// @route GET /api/incidents/by-state?state=Andhra Pradesh
// @access Public or Protected (based on usage)
export const getIncidentsByState = async (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    const regex = new RegExp(state, "i"); // case-insensitive match
    const incidents = await Incident.find({ state: regex })
      .sort({ createdAt: -1 })
      .populate("reporter", "name email");

    res.status(200).json({ incidents });
  } catch (err) {
    console.error("❌ Error fetching incidents by state:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Permanently delete a user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
