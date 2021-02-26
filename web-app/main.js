var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts) {
    contractInstance = new web3.eth.Contract(abi, "0x4930f5e13dA35463fFbf00C7546FB04813a86F5d", {from: accounts[0]});
    console.log(contractInstance);

    retrieveBettingLimit()

    $("#add_funds").click(addFunds)
    $("#start_betting").click(bet)
  });
});

function retrieveBettingLimit() {
  contractInstance.methods.getBettingLimit().call().then(function(res) {
    $("#max_amount").text(`${res} wei`);
  })
}

function addFunds() {
  let funds = $("#add_funds_value").val()

  contractInstance.methods.addFunds().send({value: funds})
  .on("transactionHash", function(hash) {
      console.log("transactionHash")
  })
  .on("confirmation", function(confirmationNr) {
      console.log("confirmation")
  })
  .on("receipt", function(receipt) {
      console.log("receipt")
      retrieveBettingLimit()
  })
}

function bet() {
  let betValue = $("#bet_value").val()
  console.log(betValue)

  contractInstance.methods.bet().send({value: betValue})
  .on("transactionHash", function(hash) {
    console.log("transactionHash")
  })
  .on("confirmation", function(confirmationNr) {
    console.log("confirmation")
  })
  .on("receipt", function(receipt) {
    console.log("receipt")
    console.log(receipt)
    if (receipt.events.BetLost) {
        $("#betting_result").text("lost")
    }
    if (receipt.events.BetWon) {
        $("#betting_result").text("won")
    }
    retrieveBettingLimit()
  })
}