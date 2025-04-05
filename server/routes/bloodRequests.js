const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

// Get all blood requests
router.get('/', async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ requestDate: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new blood request - Fix to ensure data is stored
router.post('/', async (req, res) => {
  try {
    console.log("Received request data:", req.body);
    
    // Create new blood request instance with the request body
    const request = new BloodRequest({
      requesterInfo: req.body.requesterInfo,
      bloodGroup: req.body.bloodGroup,
      quantity: req.body.quantity,
      urgency: req.body.urgency,
      location: req.body.location,
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail,
      additionalNotes: req.body.additionalNotes,
      status: 'open',
      requestDate: new Date()
    });
    
    // Save the request to the database
    const savedRequest = await request.save();
    console.log("Saved request to database:", savedRequest);
    
    res.status(201).json({ success: true, request: savedRequest });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get blood request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update blood request
router.put('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete blood request
router.delete('/:id', async (req, res) => {
  try {
    await BloodRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Respond to blood request
router.post('/:id/respond', async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const { donorId, donorName } = req.body;
    
    // Check if donor already responded
    const alreadyResponded = request.responses.some(r => r.donorId.toString() === donorId);
    if (alreadyResponded) {
      return res.status(400).json({ success: false, error: 'Already responded to this request' });
    }
    
    // Add response
    request.responses.push({
      donorId,
      donorName,
      status: 'offered',
      responseDate: new Date()
    });
    
    request.status = 'in-progress';
    await request.save();
    
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get compatible donors for a blood group
router.get('/compatible-donors/:bloodGroup', async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    
    // Blood compatibility chart
    const compatibility = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
    
    if (!compatibility[bloodGroup]) {
      return res.status(400).json({ success: false, error: 'Invalid blood group' });
    }
    
    const donors = await User.find({
      userType: 'donor',
      bloodGroup: { $in: compatibility[bloodGroup] }
    });
    
    res.json({ success: true, donors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
