// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DoubleOrNothing {
  address owner;
    
  event BetWon(address player, uint256 amount);
  event BetLost(address player, uint256 amount);
    
  constructor() public {
    owner = msg.sender;
  }
    
  function addFunds() public payable returns(uint256) {
    require(msg.sender == owner, "Only the owner can add funds.");
    return address(this).balance;
  }
    
  function withdrawFunds() public {
    require(msg.sender == owner, "Only the owner can withdraw funds.");
    msg.sender.transfer(address(this).balance);
  }
    
  function getBettingLimit() public view returns(uint256) {
    return address(this).balance;
  }
    
  // returns true if you won, and false otherwise
  function bet() public payable returns (bool) {
    require(address(this).balance > msg.value, "You cannot bet more than the maximum funds.");
        
    uint result = rand();
        
    if (result == 1) {
      // player won
      msg.sender.transfer(2 * msg.value);
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