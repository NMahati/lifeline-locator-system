
const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: String,
  website: String,
  hoursOfOperation: {
    type: String,
    required: true
  },
  acceptsWalkIns: {
    type: Boolean,
    default: true
  },
  services: [String],
  inventory: {
    type: Map,
    of: {
      quantity: Number,
      lastUpdated: Date
    }
  }
});

module.exports = mongoose.model('BloodBank', BloodBankSchema);
