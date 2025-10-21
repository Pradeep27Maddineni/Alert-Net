import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['theft', 'accident', 'murder', 'fire', 'fight', 'other']
  },
  description: {
    type: String,
    required: true
  },
  imageURLs: {
    type: [String],
    required: true
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
 state: {
    type: String,
    required: function () {
        return this.uploadedByAdmin === true;
    },
    index: true
},
  status: {
    type: String,
    enum: ['pending', 'real', 'fake'],
    default: 'real'
  },
  uploadedByAdmin: {
    type: Boolean,
    default: false
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  verifiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  helpedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

incidentSchema.index({ location: '2dsphere' });

export default mongoose.model('Incident', incidentSchema);