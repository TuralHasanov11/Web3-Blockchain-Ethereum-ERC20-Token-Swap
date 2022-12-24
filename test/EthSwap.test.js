/* eslint-disable no-undef */
/* eslint-disable jest/valid-describe-callback */
const { assert } = require("chai")

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require("chai")
  .use(require("chai-as-promised"))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, "ether")
}

contract('EthSwap', ([deployer, investor]) => {
  let token, ethSwap

  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    await token.transfer(ethSwap.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, "Tural Token")
    })
  })

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()
      assert.equal(name, "EthSwap Instant Exchange")
    })

    it('contract has tokens', async () => {
      let balance = await token.balanceOf(ethSwap.address)
      assert.equal(balance, tokens('1000000'))
    })
  })

  describe('buyTokens()', async () => {
    let result
    before(async () => {
      result = await ethSwap.buyTokens({ from: investor, value: "1000000000000000000" })
    })
    it('Allows user to purchase tokens from ethSwap for a fixed price', async () => {
      // check investor balance
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('100'))

      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('999900'))

      ethBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethBalance.toString(), web3.utils.toWei("1", 'ether'))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount, tokens('100').toString())
      assert.equal(event.rate, '100')

    })
  })


  describe('sellTokens()', async () => {
    let result
    before(async () => {
      await token.approve(ethSwap.address, tokens('100'), { from: investor })

      result = await ethSwap.sellTokens(tokens('100'), { from: investor })
    })
    it('Allows user to sell tokens to ethSwap for a fixed price', async () => {
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('0'))

      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('1000000'))
      ethBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethBalance.toString(), web3.utils.toWei("0", 'ether'))

      // Fail: Investor cannot sell more than they have
      await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
    })
  })

})