
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  phone: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['donor', 'recipient', 'hospital'],
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function() {
      return this.userType === 'donor';
    }
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  lastDonation: {
    type: Date,
    default: null
  },
  eligibleToDonateSince: {
    type: Date,
    default: null
  },
  medicalConditions: [String],
  donationHistory: [
    {
      date: Date,
      location: String,
      recipient: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
