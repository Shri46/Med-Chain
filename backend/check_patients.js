require('dotenv').config({ path: 'c:/Users/Admin/Documents/GO6/medchain/backend/.env' });
const mongoose = require('mongoose');
const Patient = require('c:/Users/Admin/Documents/GO6/medchain/backend/models/Patient');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    const count = await Patient.countDocuments();
    const patients = await Patient.find();
    console.log(`Patients count: ${count}`);
    console.log(`Patients:`, patients);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
