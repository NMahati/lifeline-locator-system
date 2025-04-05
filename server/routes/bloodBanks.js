
const express = require('express');
const router = express.Router();
const BloodBank = require('../models/BloodBank');

// Get all blood banks
router.get('/', async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find();
    res.json({ success: true, bloodBanks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new blood bank
router.post('/', async (req, res) => {
  try {
    const bloodBank = new BloodBank(req.body);
    await bloodBank.save();
    res.status(201).json({ success: true, bloodBank });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get blood bank by ID
router.get('/:id', async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ success: false, error: 'Blood bank not found' });
    }
    res.json({ success: true, bloodBank });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find nearby blood banks by coordinates
router.get('/nearby/:latitude/:longitude/:maxDistance', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.params;
    
    const bloodBanks = await BloodBank.find();
    
    // Calculate distance using Haversine formula
    const nearby = bloodBanks.map(bank => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        bank.coordinates.latitude,
        bank.coordinates.longitude
      );
      
      return { ...bank.toObject(), distance };
    })
    .filter(bank => bank.distance <= parseFloat(maxDistance))
    .sort((a, b) => a.distance - b.distance);
    
    res.json({ success: true, bloodBanks: nearby });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to calculate distance in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
