// Import the necessary Hardhat libraries
const hre = require("hardhat");

async function main() {
  // Deploy the MyToken contract
  const Token = await hre.ethers.getContractFactory("MyToken"); // Make sure the contract name matches
  const token = await Token.deploy(); // Deploy the contract

  await token.deployed(); // Wait until the contract is deployed

  console.log("Token deployed to:", token.address); // Log the deployed contract address
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0)) // Exit process after deployment
  .catch((error) => {
    console.error(error); // Log any errors
    process.exit(1); // Exit with failure
  });
