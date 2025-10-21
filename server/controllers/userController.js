  // File: controllers/userController.js
  import User from '../models/User.js';
  import Incident from '../models/Incident.js';
  import mongoose from 'mongoose'; // Add to the top

  export const getUserNotifications = async (req, res) => {
    try {
      const userId = req.user?.id;

      // ✅ 1. Ensure it's a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(userId)
        .populate('notifications.incidentId')
        .lean();

      if (!user) return res.status(404).json({ message: "User not found" });

      const formatted = user.notifications
        .map((n) => ({
          _id: n._id,
          message: n.message,
          type: n.type,
          createdAt: n.createdAt,
          incident: n.incidentId,
        }))
        .reverse();

      res.status(200).json({ notifications: formatted });
    } catch (err) {
      console.error("❌ Error fetching notifications:", err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };


  // controllers/userController.js
  export const deleteUserNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      if (!notificationId) {
        return res.status(400).json({ message: "Missing notification ID" });
      }

      // Step 1: Get the user's notification to check incidentId and type
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const notif = user.notifications.find(n => n._id.toString() === notificationId);
      if (!notif) {
        return res.status(404).json({ message: 'Notification not found in user' });
      }

      const { incidentId, type } = notif;

      // Step 2: Remove notification using $pull
      await User.findByIdAndUpdate(userId, {
        $pull: { notifications: { _id: notificationId } }
      });

      // Step 3: If it's a self-report, also delete the incident + clean all related notifications
      if (type === 'self-report' && incidentId) {
        const incident = await Incident.findById(incidentId);

        if (incident && incident.reporter.toString() === userId) {
          await Incident.findByIdAndDelete(incidentId);

          // Remove related notifications from all users
          await User.updateMany(
            {},
            { $pull: { notifications: { incidentId } } }
          );

          console.log(`🗑️ Deleted incident ${incidentId} and related notifications`);
        }
      }

      res.status(200).json({ message: 'Notification deleted (and incident if self-reported)' });
    } catch (err) {
      console.error("❌ Error in deleting notification:", err);
      res.status(500).json({ message: 'Server error' });
    }
  };



  import cloudinary from 'cloudinary';
  import fs from 'fs';

  export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;

      const updates = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      };

      if (req.file) {
        // ✅ Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "AlertNetUsers",
          transformation: [{ width: 300, height: 300, crop: "fill" }],
        });

        updates.avatar = result.secure_url;

        // ✅ Only delete local file after Cloudinary upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }

      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      }).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ user });
    } catch (err) {
      console.error("❌ Profile update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };


  // ✅ Get Top Reporters with their incident count
  export const getTopReporters = async (req, res) => {
    try {
      const reporters = await User.find({ isTopReporter: true }).select("name avatar");

      // For each top reporter, count number of incidents reported
      const data = await Promise.all(
        reporters.map(async (user) => {
          const count = await Incident.countDocuments({ reporter: user._id });
          return {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            incidentCount: count,
          };
        })
      );

      res.status(200).json(data);
    } catch (err) {
      console.error("❌ Error fetching top reporters:", err);
      res.status(500).json({ message: 'Server error' });
    }
  };


