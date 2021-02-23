var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts) {
        contractInstance = new web3.eth.Contract(abi, "0x03F37Ec985396B4a957c3A06b72576Bd131189C5", {from: accounts[0]});
        console.log(contractInstance);
    });
});
