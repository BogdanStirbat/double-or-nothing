const DoubleOrNothingWithOracles = artifacts.require("DoubleOrNothingWithOracles");

module.exports = function(deployer) {
  deployer.deploy(DoubleOrNothingWithOracles);
}