import React, { useState } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

export default function Main({ ethBalance, tokenBalance, sellTokens, buyTokens }) {

  const [currentForm, setCurrentForm] = useState('buy')
  let content

  if (currentForm === 'buy') {
    content = <BuyForm
      ethBalance={ethBalance}
      tokenBalance={tokenBalance}
      buyTokens={buyTokens}
    />
  } else {
    content = <SellForm
      ethBalance={ethBalance}
      tokenBalance={tokenBalance}
      sellTokens={sellTokens}
    />
  }

  return (
    <div id="content" className="mt-3">

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-success"
          onClick={() => {
            setCurrentForm('buy')
          }}
        >
          Buy
        </button>
        <span className="text-muted">&lt; &nbsp; &gt;</span>
        <button
          className="btn btn-danger"
          onClick={() => {
            setCurrentForm('sell')
          }}
        >
          Sell
        </button>
      </div>

      <div className="card mb-4" >

        <div className="card-body">

          {content}

        </div>

      </div>

    </div>
  )
}
