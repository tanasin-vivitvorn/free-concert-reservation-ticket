const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSeeder() {
  try {
    console.log('Testing seeder endpoints...');
    
    // Test seeder status
    const statusResponse = await axios.get(`${BASE_URL}/seeder/status`);
    console.log('Seeder status:', statusResponse.data);
    
    // Test seeding users
    console.log('\nSeeding users...');
    const usersResponse = await axios.post(`${BASE_URL}/seeder/seed-users`);
    console.log('Users seeding result:', usersResponse.data);
    
    // Test seeding concerts
    console.log('\nSeeding concerts...');
    const concertsResponse = await axios.post(`${BASE_URL}/seeder/seed-concerts`);
    console.log('Concerts seeding result:', concertsResponse.data);
    
    console.log('\nAll seeding tests completed!');
  } catch (error) {
    console.error('Error testing seeder:', error.response?.data || error.message);
  }
}

testSeeder(); 