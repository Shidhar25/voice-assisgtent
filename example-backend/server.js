require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Different from the main app port

// Middleware
app.use(cors());
app.use(express.json());

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Store for voice inputs (in memory for demo purposes)
let voiceInputs = [];
let emergencyRequests = [];

// Route to receive voice input
app.post('/voice-input', (req, res) => {
  console.log('Received POST request to /voice-input');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { message, timestamp, source, type } = req.body;
  
  // Validate required fields
  if (!message && !req.body.emergencyData) {
    console.log('Validation failed: Missing message or emergencyData');
    return res.status(400).json({ 
      success: false,
      error: 'Message is required for voice input or emergencyData for emergency requests',
      received: req.body
    });
  }

  // Create voice input record
  const voiceInput = {
    id: Date.now(),
    message,
    timestamp: timestamp || new Date().toISOString(),
    source: source || 'unknown',
    receivedAt: new Date().toISOString()
  };

  // Handle emergency data separately
  if (req.body.type === 'emergency' && req.body.emergencyData) {
    const emergencyRequest = {
      id: Date.now(),
      ...req.body.emergencyData,
      receivedAt: new Date().toISOString(),
      source: req.body.source || 'emergency-voice-assistant'
    };
    
    emergencyRequests.push(emergencyRequest);
    
    // Create location string
    const locationStr = emergencyRequest.address || 
      (emergencyRequest.latitude && emergencyRequest.longitude ? 
        `${emergencyRequest.latitude}, ${emergencyRequest.longitude}` : 
        'Unknown location');
    
    // Log emergency to separate file
    const emergencyLogEntry = `${emergencyRequest.receivedAt} - EMERGENCY [${emergencyRequest.issueType}] at ${locationStr}\n` +
      `  Services: ${emergencyRequest.needAmbulance ? 'Ambulance(' + (emergencyRequest.requestedAmbulanceCount || 1) + ') ' : ''}` +
      `${emergencyRequest.needPolice ? 'Police(' + (emergencyRequest.requestedPoliceCount || 1) + ') ' : ''}` +
      `${emergencyRequest.needFireBrigade ? 'Fire(' + (emergencyRequest.requestedFireTruckCount || 1) + ') ' : ''}\n` +
      `  For: ${emergencyRequest.isForSelf ? 'Self' : 'Someone else'}\n` +
      `  Phone: ${emergencyRequest.victimPhoneNumber || 'Not provided'}\n` +
      `  Notes: ${emergencyRequest.notes || 'None'}\n\n`;
    
    fs.appendFileSync(path.join(logsDir, 'emergency-requests.log'), emergencyLogEntry);
    
    console.log('🚨 EMERGENCY REQUEST RECEIVED:', emergencyRequest);
    
    return res.json({
      success: true,
      message: 'Emergency request received and logged',
      data: emergencyRequest,
      emergencyId: emergencyRequest.id
    });
  }
  
  // Store regular voice input in memory
  voiceInputs.push(voiceInput);

  // Log to file
  const logEntry = `${voiceInput.receivedAt} - [${voiceInput.source}] "${voiceInput.message}"\n`;
  fs.appendFileSync(path.join(logsDir, 'voice-inputs.log'), logEntry);

  console.log('Received voice input:', voiceInput);

  // Respond with success
  res.json({
    success: true,
    message: 'Voice input received successfully',
    data: voiceInput
  });
});

// Route to get all received voice inputs
app.get('/voice-inputs', (req, res) => {
  res.json({
    success: true,
    count: voiceInputs.length,
    data: voiceInputs
  });
});

// Route to get all emergency requests
app.get('/emergency-requests', (req, res) => {
  res.json({
    success: true,
    count: emergencyRequests.length,
    data: emergencyRequests
  });
});

// Route to clear all voice inputs
app.delete('/voice-inputs', (req, res) => {
  voiceInputs = [];
  res.json({
    success: true,
    message: 'All voice inputs cleared'
  });
});

// Route to clear all emergency requests
app.delete('/emergency-requests', (req, res) => {
  emergencyRequests = [];
  res.json({
    success: true,
    message: 'All emergency requests cleared'
  });
});

// Debug endpoint for testing connectivity
app.get('/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Debug endpoint working',
    headers: req.headers,
    timestamp: new Date().toISOString(),
    environment: {
      port: PORT
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Voice input backend is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Voice input backend server running on http://localhost:${PORT}`);
  console.log(`Logs will be saved to: ${logsDir}`);
  
  console.log('\nAvailable endpoints:');
  console.log(`  POST http://localhost:${PORT}/voice-input - Receive voice input & emergency data`);
  console.log(`  GET  http://localhost:${PORT}/voice-inputs - Get all voice inputs`);
  console.log(`  GET  http://localhost:${PORT}/emergency-requests - Get all emergency requests`);
  console.log(`  DELETE http://localhost:${PORT}/voice-inputs - Clear all voice inputs`);
  console.log(`  DELETE http://localhost:${PORT}/emergency-requests - Clear all emergency requests`);
  console.log(`  GET  http://localhost:${PORT}/health - Health check`);
}); 