// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Ensure you import ERC20

contract MehdiTechnology is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 100000000 * (10 ** 18); // 100 million tokens

    constructor() ERC20("Mehdi Technology", "MTT") {
        // Mint the total supply to the deployer's address
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
/// launch pad
// staking
// ico
//