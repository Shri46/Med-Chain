const axios = require('axios');

async function test() {
  try {
    // 1. Get hospitals to get a valid ID
    const hospRes = await axios.get('http://localhost:5000/hospitals');
    const hospitals = hospRes.data;
    if (hospitals.length === 0) {
      console.log('No hospitals found. Cannot test patient creation.');
      return;
    }
    const hId = hospitals[0]._id;

    // 2. Post a patient
    const payload = {
      name: 'Test Patient',
      walletAddress: '0xTest123',
      hospitalId: hId
    };
    console.log('Posting:', payload);
    const patRes = await axios.post('http://localhost:5000/patients', payload);
    console.log('Response:', patRes.data);

    // 3. Get patients (Wait, we don't have GET /patients yet!)
    // But we know it succeeded if status 201
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Request failed:', error.message);
    }
  }
}
test();
