// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BlockchainTransfer {
    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function transfer(address payable _to) public payable {
        require(msg.value > 0, "Send some ETH");
        _to.transfer(msg.value);
        emit Transfer(msg.sender, _to, msg.value);
    }
}