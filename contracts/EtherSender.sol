// contracts/EtherSender.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EtherSender {
    event EtherSent(address indexed from, address indexed to, uint256 amount);

    // Function to send Ether from the contract to a specified address
    function sendEther(address payable _to) public payable {
        require(msg.value > 0, "Must send some Ether");
        require(_to != address(0), "Invalid address");

        // Transfer Ether to the recipient
        (bool success, ) = _to.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        emit EtherSent(msg.sender, _to, msg.value);
    }

    // Function to receive Ether directly to the contract
    receive() external payable {}

    // Function to check the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
