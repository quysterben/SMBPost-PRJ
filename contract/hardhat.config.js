require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

const INFURA_API_KEY = "605c3ebbfd4340ad95e61ef40810ba82"

const SEPOLIA_PRIVATE_KEY = "5ca8ba48b928e1d67c5c72d7183d4f0900f1261bd06b3fc72897bc6c09c18719"

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY],
        }
    }
};
