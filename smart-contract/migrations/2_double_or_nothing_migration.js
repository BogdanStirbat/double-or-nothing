const DoubleOrNothing = artifacts.require("DoubleOrNothing");

module.exports = function(deployer) {
  deployer.deploy(DoubleOrNothing);
}