const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  publicKey: { type: String },
  dob: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  guardianName: { type: String },
  guardianPhone: { type: String },
  guardianEmail: { type: String },
  allergies: { type: String },
  chronicConditions: { type: String },
  emergencyNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
