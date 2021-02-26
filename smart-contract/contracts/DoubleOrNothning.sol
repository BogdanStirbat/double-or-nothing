// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DoubleOrNothing {
  address owner;
  uint256 balance;
    
  event BetWon(address player, uint256 amount);
  event BetLost(address player, uint256 amount);
    
  constructor() public {
    owner = msg.sender;
  }
    
  function addFunds() public payable returns(uint256) {
    require(msg.sender == owner, "Only the owner can add funds");
    balance += msg.value;
    return address(this).balance;
  }
    
  function withdrawFunds() public {
    require(msg.sender == owner, "Only the owner can withdraw funds.");
    msg.sender.transfer(address(this).balance);
    balance = 0;
  }
    
  function getBettingLimit() public view returns(uint256) {
    return address(this).balance;
  }
    
  // returns true if you won, and false otherwise
  function bet() public payable returns (bool) {
    require(balance >= msg.value, "You cannot bet more than the maximum funds.");
    balance += msg.value;
        
    uint result = rand();
        
    if (result == 1) {
      // player won
      msg.sender.transfer(2 * msg.value);
      balance -= 2 * msg.value;
      emit BetWon(msg.sender, msg.value);
      return true;
    }
        
    //player lost
    emit BetLost(msg.sender, msg.value);
    return false;
  }
    
  function rand() private returns (uint) {
    return block.timestamp % 2;
  }
}