
const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  requesterInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['recipient', 'hospital'],
      required: true
    }
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'critical'],
    required: true
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: String,
  additionalNotes: String,
  status: {
    type: String,
    enum: ['open', 'in-progress', 'fulfilled', 'canceled'],
    default: 'open'
  },
  responses: [
    {
      donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      donorName: String,
      status: {
        type: String,
        enum: ['offered', 'accepted', 'rejected', 'completed'],
        default: 'offered'
      },
      responseDate: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
