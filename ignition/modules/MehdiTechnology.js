const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MehdiTechnologyModule", (m) => {
  // Deploy the MehdiTechnology contract
  const mehdiTechnology = m.contract("MehdiTechnology");

  return { mehdiTechnology };
});
x``