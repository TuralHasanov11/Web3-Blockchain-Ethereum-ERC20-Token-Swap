import React, { useState } from 'react'
import tokenLogo from '../assets/token-logo.png'
import ethLogo from '../assets/eth-logo.png'

export default function BuyForm({ ethBalance, tokenBalance, buyTokens }) {

  const [inputValue, setInputValue] = useState()
  const [outputValue, setOutputValue] = useState()

  function submitForm(event) {
    event.preventDefault()
    let etherAmount = window.web3.utils.toWei(inputValue.toString(), 'Ether')
    buyTokens(etherAmount)
  }

  function onInputChange(event) {
    setInputValue(event.target.value)
    const etherAmount = inputValue.value.toString()
    setOutputValue(etherAmount * 100)
  }

  return (
    <form className="mb-3" onSubmit={submitForm}>
      <div>
        <label className="float-left"><b>Input</b></label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(ethBalance, 'Ether')}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          onChange={onInputChange}
          value={inputValue}
          className="form-control form-control-lg"
          placeholder="0"
          required />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ethLogo} height='32' alt="" />
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div>
        <label className="float-left"><b>Output</b></label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(tokenBalance, 'Ether')}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={outputValue}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={tokenLogo} height='32' alt="" />
            &nbsp; DApp
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">1 ETH = 100 DApp</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
    </form>
  )
}
