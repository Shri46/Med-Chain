const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    walletAddress: { type: String, unique: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

module.exports = mongoose.model('Doctor', doctorSchema);
