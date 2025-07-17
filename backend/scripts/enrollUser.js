const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const yaml = require('js-yaml');

async function enrollUser() {
  console.log('👤 Enrolling user with Fabric CA...');
  
  try {
    // Load connection profile
    const ccpPath = path.resolve(__dirname, 'connection-org1.yaml');
    const ccpText = fs.readFileSync(ccpPath, 'utf8');
    const ccp = yaml.load(ccpText);
    
    // Create a new CA client for interacting with the CA
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    
    // Create a new file system wallet for managing identities
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    
    // Check to see if we've already enrolled the user
    const userExists = await wallet.get('appUser');
    if (userExists) {
      console.log('✅ An identity for the user "appUser" already exists in the wallet');
      return;
    }
    
    // Check to see if we've already enrolled the admin user
    const adminExists = await wallet.get('admin');
    if (!adminExists) {
      console.log('❌ An identity for the admin user "admin" does not exist in the wallet');
      console.log('💡 Enrolling the admin user ...');
      
      // Enroll the admin user, and import the new identity into the wallet
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };
      await wallet.put('admin', x509Identity);
      console.log('✅ Successfully enrolled admin user and imported it into the wallet');
    }
    
    // Register the user, enroll the user, and import the new identity into the wallet
    const adminIdentity = await wallet.get('admin');
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    
    // Register the user
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: 'appUser',
      role: 'client'
    }, adminUser);
    
    // Enroll the user
    const enrollment = await ca.enroll({
      enrollmentID: 'appUser',
      enrollmentSecret: secret
    });
    
    // Import the new identity into the wallet
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    await wallet.put('appUser', x509Identity);
    console.log('✅ Successfully registered and enrolled the user "appUser" and imported it into the wallet');
    
  } catch (error) {
    console.error('❌ Failed to enroll user:', error.message);
    console.log('💡 Make sure your Fabric network is running and the connection profile is correct');
  }
}

enrollUser(); 