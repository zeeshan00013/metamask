async function main() {
    const MehdiTechnology = await hre.ethers.getContractFactory("MehdiTechnology"); // Use the correct casing
    const mehdiTechnology = await MehdiTechnology.deploy();
  
    await mehdiTechnology.deployed();
  
    console.log("MehdiTechnology deployed to:", mehdiTechnology.address);
  }
  