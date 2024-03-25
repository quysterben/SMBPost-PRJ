const fs = require('fs');
const path = require('path');

async function main() {
    // eslint-disable-next-line no-undef
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    // eslint-disable-next-line no-undef
    const contracts = await ethers.deployContract('SMBPOST');

    const contractAddress = await contracts.getAddress();
    console.log('Contracts address:', contractAddress);

    const contractABI = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'artifacts/contracts/SMBPOST.sol/SMBPOST.json'), 'utf8')).abi;

    fs.writeFileSync(path.join(__dirname, '..', 'contract-info.json'), JSON.stringify({ contractAddress, contractABI }));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });