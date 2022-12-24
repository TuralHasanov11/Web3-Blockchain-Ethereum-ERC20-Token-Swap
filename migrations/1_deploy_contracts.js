var Token = artifacts.require("Token");
var EthSwap = artifacts.require("EthSwap");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // deploy our Token
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed()

  await token.transfer(ethSwap.address, '1000000000000000000000000')
};