import User from '../models/User.js';

export const sendAndStoreNotification = async (io, users, notification) => {
  for (const user of users) {
    try {
      const userDoc = typeof user === 'object' ? user : await User.findById(user);
      if (!userDoc) continue;

      userDoc.notifications.push(notification);
      await userDoc.save();

      io.to(userDoc._id.toString()).emit("notification", {
        ...notification,
        incident: notification.incidentObj, // send full incident for client display
      });

      console.log("📥 Stored + emitted notification to", userDoc._id);
    } catch (err) {
      console.error(`❌ Failed to notify ${user._id}:`, err.message);
    }
  }
};
