// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const EtherSender = await hre.ethers.getContractFactory("EtherSender");
  const etherSender = await EtherSender.deploy();

  await etherSender.deployed();

  console.log(`EtherSender deployed to: ${etherSender.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });