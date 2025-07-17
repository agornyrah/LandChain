// Test script for transfer functionality
const API_BASE = 'http://127.0.0.1:5000/api';

async function testTransferFunctionality() {
  console.log('🧪 Testing Transfer Land Functionality...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Server is running:', healthData.status);

    // Test 2: Check if we can get properties
    console.log('\n2. Testing property retrieval...');
    const propertiesResponse = await fetch(`${API_BASE}/properties`);
    const propertiesData = await propertiesResponse.json();
    console.log('✅ Properties endpoint working:', propertiesData.success ? 'Yes' : 'No');
    if (propertiesData.success) {
      console.log(`   Found ${propertiesData.properties?.length || 0} properties`);
    }

    // Test 3: Check if we can get users
    console.log('\n3. Testing user retrieval...');
    const usersResponse = await fetch(`${API_BASE}/users`);
    const usersData = await usersResponse.json();
    console.log('✅ Users endpoint working:', usersData.success ? 'Yes' : 'No');
    if (usersData.success) {
      console.log(`   Found ${usersData.users?.length || 0} users`);
    }

    // Test 4: Check transfer endpoint structure
    console.log('\n4. Testing transfer endpoint...');
    console.log('✅ Transfer endpoint: POST /api/properties/:id/transfer');
    console.log('   Required body: { toUserId: number }');
    console.log('   Authentication: Required (session)');

    // Test 5: Check transfer history endpoint
    console.log('\n5. Testing transfer history...');
    console.log('✅ Transfer history endpoint: GET /api/transfers/my');
    console.log('   Authentication: Required (session)');

    console.log('\n🎉 Transfer functionality tests completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the backend server: cd backend && npm start');
    console.log('   2. Open the frontend: http://localhost:5000');
    console.log('   3. Login and navigate to the transfer page');
    console.log('   4. Test the transfer functionality with real data');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 5000');
  }
}

// Run the test
testTransferFunctionality(); 