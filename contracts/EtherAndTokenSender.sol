// contracts/EtherAndTokenSender.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EtherAndTokenSender {
    event EtherSent(address indexed from, address indexed to, uint256 amount);
    event TokenSent(address indexed from, address indexed to, uint256 amount, address token);

    // Function to send Ether to a specified address
    function sendEther(address payable _to) public payable {
        require(msg.value > 0, "Must send some Ether");
        require(_to != address(0), "Invalid address");

        // Transfer Ether to the recipient
        (bool success, ) = _to.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        emit EtherSent(msg.sender, _to, msg.value);
    }

    // Function to send ERC20 tokens to a specified address
    function sendTokens(address _token, address _to, uint256 _amount) public {
        require(_token != address(0), "Invalid token address");
        require(_to != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than zero");

        IERC20 token = IERC20(_token);
        require(token.transferFrom(msg.sender, _to, _amount), "Token transfer failed");

        emit TokenSent(msg.sender, _to, _amount, _token);
    }

    // Function to check the contract's balance of Ether
    function getEtherBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to check the contract's balance of a specific ERC20 token
    function getTokenBalance(address _token) public view returns (uint256) {
        IERC20 token = IERC20(_token);
        return token.balanceOf(address(this));
    }

    // Function to receive Ether directly to the contract
    receive() external payable {}
}
