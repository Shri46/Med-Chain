const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
