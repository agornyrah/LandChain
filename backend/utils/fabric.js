const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const ccpPath = path.resolve(__dirname, '../connection-org1.yaml');
const ccp = yaml.load(fs.readFileSync(ccpPath, 'utf8'));

async function getContract() {
  const wallet = await Wallets.newFileSystemWallet(path.resolve(__dirname, '../wallet'));
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true }
  });
  const network = await gateway.getNetwork('mychannel');
  return network.getContract('landregistry');
}

module.exports = { getContract }; 