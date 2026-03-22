require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');

const app = express();
app.use(cors());
app.use(express.json());

const dns = require('dns');
// Use Google's public DNS to resolve the MongoDB Atlas SRV record
// This fixes the "querySrv ECONNREFUSED" error on some Windows PCs
dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medchain', {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- HOSPITALS API ---
app.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/hospitals', async (req, res) => {
  try {
    const { name } = req.body;
    let hospital = await Hospital.findOne({ name });
    if (!hospital) {
      hospital = new Hospital({ name });
      await hospital.save();
    }
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DOCTORS API ---
app.get('/doctors', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    const filter = hospitalId ? { hospitalId } : {};
    const doctors = await Doctor.find(filter).populate('hospitalId');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/doctors', async (req, res) => {
  try {
    const { name, walletAddress, hospitalId } = req.body;
    
    // Check if hospital exists
    const hospitalExists = await Hospital.findById(hospitalId);
    if (!hospitalExists) {
        return res.status(404).json({ error: 'Hospital not found' });
    }

    let doctor = await Doctor.findOne({ walletAddress });
    if (doctor) {
      // Update existing doctor
      doctor.name = name;
      doctor.hospitalId = hospitalId;
      await doctor.save();
    } else {
      doctor = new Doctor({ name, walletAddress, hospitalId });
      await doctor.save();
    }
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
