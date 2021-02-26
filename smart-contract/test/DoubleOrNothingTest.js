const DoubleOrNothing = artifacts.require("DoubleOrNothing");
const truffleAssert = require("truffle-assertions");

contract("DoubleOrNothing", async function(accounts) {
  let instance

  before(async function() {
    instance = await DoubleOrNothing.deployed()
  })

  it("the owner should be able to add funds", async function() {
    await truffleAssert.passes(instance.addFunds({from: accounts[0], value: web3.utils.toWei("1", "ether")}))
  })

  it("the owner should be able to withraw funds", async function() {
    let beforeWithrawBalance = await web3.eth.getBalance(accounts[0])
    await instance.withdrawFunds({from: accounts[0]});
    let afterWithrawBalance = await web3.eth.getBalance(accounts[0])

    assert(Number(beforeWithrawBalance) < Number(afterWithrawBalance), "The balance withdrawn from the smart contract should be in the account")
  })

  it("a non-owner should not be able to add funds", async function() {
    await truffleAssert.fails(instance.addFunds({from: accounts[1], value: 1000}))
  })

  it("a non-owner should not be able to withdraw funds", async function() {
    await truffleAssert.fails(instance.withdrawFunds({from: accounts[1]}))
  })

  it("get betting limit returns 0 if there are no funds in the contract", async function() {
    let betLimit = await instance.getBettingLimit({from: accounts[0]})

    assert(Number(betLimit) == 0)
  })

  it("get betting limit should be able to be called by a non-owner as well", async function() {
    await truffleAssert.passes(instance.getBettingLimit({from: accounts[1]}))
  })

  it("after funds were added to the smart cotract, it should be reflected in the bet limit", async function() {
    await instance.addFunds({from: accounts[0], value: web3.utils.toWei("1", "ether")})
    let betLimit = await instance.getBettingLimit({from: accounts[0]})

    assert(Number(betLimit) > 0)
  })

  it("play the bet, and balances should be updated accodingly", async function() {
    let beforeSmartContractFunds = await instance.getBettingLimit({from: accounts[0]})
    let beforePlayerFunds = await web3.eth.getBalance(accounts[0])

    let tx = await instance.bet({from: accounts[0], value: web3.utils.toWei("0.5", "ether")})

    let afterSmartContractFunds = await instance.getBettingLimit({from: accounts[0]})
    let afterPlayerFunds = await web3.eth.getBalance(accounts[0])

    let betLost = tx.logs[0].event == "BetLost"
    let betWin = tx.logs[0].event == "BetWon"

    assert(betLost || betWin, "At least one event should had been emited.")

    if (betLost) {
      assert(Number(afterSmartContractFunds) > Number(beforeSmartContractFunds), "Smart contract should had now more funds.")
      assert(Number(afterPlayerFunds) < Number(beforePlayerFunds), "Player should have less funds.")
    }

    if (betWin) {
      assert(Number(afterSmartContractFunds) < Number(beforeSmartContractFunds), "Smart contract should had now less funds.")
      assert(Number(afterPlayerFunds) > Number(beforePlayerFunds), "Player should have more funds.")
    }
  })


  it("should withdraw all funds before tests end", async function() {
    await truffleAssert.passes(instance.withdrawFunds({from: accounts[0]}))
  })
})