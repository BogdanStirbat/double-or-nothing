var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts) {
    contractInstance = new web3.eth.Contract(abi, "0x65fC93e4e31629C968f6E9EF7FCa6564Be7FA4a6", {from: accounts[0]});
    console.log(contractInstance);

    retrieveBettingLimit()

    $("#add_funds").click(addFunds)
    $("#withdraw_funds").click(withdrawFunds)
    $("#start_betting").click(bet)
    $("#get_betting_state").click(getBettingState)
  });
});

function retrieveBettingLimit() {
  contractInstance.methods.getBalance().call().then(function(res) {
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

function withdrawFunds() {
  contractInstance.methods.withdrawFunds().send()
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

    retrieveBettingLimit()
  })
}

function getBettingState() {
  contractInstance.methods.getBettingState().call().then(function(res) {
    console.log("getBettingState")
    console.log(res)
    let finished = res[1];
    let won = res[2];
    if (finished) {
      if (won) {
        $("#betting_result").text(`you won the bet`)
      } else {
        $("#betting_result").text(`you lost the bet`)
      }
      deleteBettingGame()
    } else {
      $("#betting_result").text(`the bet is still in progress`)
    }
  })
}

function deleteBettingGame() {
  contractInstance.methods.deleteBettingGame().call().then(function(res) {
    console.log(res)
  })
}