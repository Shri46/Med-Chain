require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Patient = require('./models/Patient');
const Hospital = require('./models/Hospital');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medchain')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Hospital Routes
app.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/hospitals', async (req, res) => {
    try {
        const { name } = req.body;
        const newHospital = new Hospital({ name });
        await newHospital.save();
        res.status(201).json(newHospital);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Patient Routes
app.post('/patients/register', async (req, res) => {
    try {
        const { walletAddress, ...patientData } = req.body;
        let patient = await Patient.findOne({ walletAddress });
        if (patient) {
            Object.assign(patient, patientData);
            await patient.save();
        } else {
            patient = new Patient({ walletAddress, ...patientData });
            await patient.save();
        }
        res.status(201).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find().populate('hospitalId');
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/patients/:walletAddress', async (req, res) => {
    try {
        const patient = await Patient.findOne({ walletAddress: req.params.walletAddress }).populate('hospitalId');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/patients/update', async (req, res) => {
    try {
        const { walletAddress, ...updateData } = req.body;
        const patient = await Patient.findOneAndUpdate(
            { walletAddress },
            updateData,
            { new: true }
        );
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/patients/byHospital/:hospitalId', async (req, res) => {
    try {
        const patients = await Patient.find({ hospitalId: req.params.hospitalId });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
