const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function setupFabric() {
  console.log('🔧 Setting up Fabric connection...');
  
  try {
    // Copy connection profile from WSL Fabric network
    const sourcePath = '/mnt/c/Users/LENOVO/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml';
    const destPath = path.join(__dirname, 'connection-org1.yaml');
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log('✅ Connection profile copied successfully');
    } else {
      console.log('❌ Connection profile not found at:', sourcePath);
      console.log('💡 Please copy the connection profile manually from your Fabric network');
      console.log('📁 Expected location: ~/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml');
      return;
    }
    
    // Create wallet directory
    const walletPath = path.join(__dirname, 'wallet');
    if (!fs.existsSync(walletPath)) {
      fs.mkdirSync(walletPath);
      console.log('✅ Wallet directory created');
    }
    
    console.log('✅ Fabric setup completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Run: npm install');
    console.log('   2. Run: node enrollUser.js');
    console.log('   3. Run: npm start');
    
  } catch (error) {
    console.error('❌ Error setting up Fabric:', error.message);
  }
}

setupFabric(); 