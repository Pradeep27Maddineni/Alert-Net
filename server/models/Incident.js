import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['theft', 'accident', 'murder', 'fire', 'fight', 'other']//It must be one of the listed categories — nothing else is allowed.
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
    /*
    This is GeoJSON format, used for map coordinates (latitude & longitude).
    "type": "Point" is standard GeoJSON.
    "coordinates": [longitude, latitude]
    */
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
/*
The second argument { timestamps: true } means:
MongoDB will automatically add:
createdAt
updatedAt
to each document.
*/

incidentSchema.index({ location: '2dsphere' });
/*
The incidentSchema.index({ location: '2dsphere' }) line at the end
makes MongoDB understand this field as a geospatial field —
so you can run queries like “find incidents near me”.
*/

export default mongoose.model('Incident', incidentSchema);
