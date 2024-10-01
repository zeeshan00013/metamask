async function main() {
    const BulkSender = await ethers.getContractFactory("BulkSender");
    const bulkSender = await BulkSender.deploy();
  
    await bulkSender.deployed();
  
    console.log("BulkSender deployed to:", bulkSender.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  