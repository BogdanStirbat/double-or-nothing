// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./provableAPI.sol";

contract DoubleOrNothingWithOracles is usingProvable {
  uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
  uint256 GAS_FOR_CALLBACK = 200000;
    
  address owner;
  uint256 balance;
  
  struct BetState {
      address payable playerAddress;
      uint256 amount;
      bool finished;
      bool won;
  }
  
  mapping(address => BetState) bettingGames;
  mapping(bytes32 => address) randomProcessPerAddress;
  
  event RandomRequestGenerated(bytes32 queryId, address playerAddress);
  event BetCompleted(bytes32 _queryId, uint256 randomNumber);
    
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
  
  function getBalance() public view returns(uint256) {
      return balance;
  }

  function bet() public payable {
    require(balance - GAS_FOR_CALLBACK > msg.value, "You cannot bet more than the maximum funds.");
    require(bettingGames[msg.sender].amount == 0, "You cannot play while you have a game in progress");
    balance += msg.value;
    
    BetState memory newState = BetState(msg.sender, msg.value, false, false);
    bettingGames[msg.sender] = newState;
    
    generateRandomRequest();
  }
  
  function getBettingState() public view returns (uint256, bool, bool) {
    return (bettingGames[msg.sender].amount, bettingGames[msg.sender].finished, bettingGames[msg.sender].won);
  }
  
  function deleteBettingGame() public {
    require(bettingGames[msg.sender].finished, "You can only delete a finished betting game.");
    
    delete bettingGames[msg.sender];
  }
  
  function generateRandomRequest() payable public {
    uint256 QUERY_EXECUTION_DELAY = 0;
    
    bytes32 queryId = provable_newRandomDSQuery(
      QUERY_EXECUTION_DELAY,
      NUM_RANDOM_BYTES_REQUESTED,
      GAS_FOR_CALLBACK
    );
    balance -= GAS_FOR_CALLBACK;
    
    randomProcessPerAddress[queryId] = msg.sender;
    
    emit RandomRequestGenerated(queryId, msg.sender);
  }
  
  // this function gets called by the oracle
  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
    uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
    
    if (randomNumber == 0) {
      // the bet was lost by the player
      bettingGames[randomProcessPerAddress[_queryId]].finished = true;
      bettingGames[randomProcessPerAddress[_queryId]].won = false;
    }
    
    if (randomNumber == 1) {
      //the bet was won by the player
      bettingGames[randomProcessPerAddress[_queryId]].finished = true;
      bettingGames[randomProcessPerAddress[_queryId]].won = true;
      
      bettingGames[randomProcessPerAddress[_queryId]].playerAddress.transfer(2 * bettingGames[randomProcessPerAddress[_queryId]].amount);
      balance -= 2 * bettingGames[randomProcessPerAddress[_queryId]].amount;
    }
    
    emit BetCompleted(_queryId, randomNumber);
  }
}