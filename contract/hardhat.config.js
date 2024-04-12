require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

const ALCHEMY_API_KEY = "UJZnvoikf9eRnwVsExDf1xkUPAkQh8oP"

const SEPOLIA_PRIVATE_KEY = "6bcde10895c474713f822d81480c331696057f534d61ae2680692da1accbfb60"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.0",
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY],
        }
    }
};
