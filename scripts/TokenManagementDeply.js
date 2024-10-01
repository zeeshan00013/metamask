const { ethers } = require("hardhat");

async function main() {
    const TokenManagement = await ethers.getContractFactory("TokenManagement");
    const tokenManagement = await TokenManagement.deploy();
    await tokenManagement.deployed();
    console.log("Token Management contract deployed to:", tokenManagement.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
