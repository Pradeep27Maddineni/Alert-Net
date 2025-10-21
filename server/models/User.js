import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, enum: ['alert', 'self-report'], default: 'alert' },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  phone: {
    type: String,
    default: ''
  },

  isTopReporter: {
    type: Boolean,
    default: false
  },

  points: {
    type: Number,
    default: 0
  },

  avatar: {
    type: String, // will store image URL or path (e.g. /uploads/abc.jpg)
    default: ''
  },

  notifications: [notificationSchema]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
