
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

const { SEPOLIA_API_KEY, DEPLOYER_PRIVATE_KEY } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`]
  }
  },
  etherscan: {
     apiKey:{
      sepolia:"7WCDVFJNCNNQNMP4HM1SRCIPFED4ZXEFJM",
     }
  },
  sourcify: {
    enabled: true,  // Enable Sourcify verification if desired
},

  solidity: {
    compilers: [
      {
        version: "0.8.18", // The existing version
      },
      {
        version: "0.8.27", // Add this if your contracts require this version
      },
      {
        version: "0.8.20", // Add this version to match OpenZeppelin dependencies
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    timeout: 20000,
  },

}
