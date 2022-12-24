import logo from './logo.svg';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import EthSwap from "./abis/EthSwap.json";
import Token from "./abis/Token.json";
import Navbar from './components/Navbar';
import Main from './components/Main';


function App() {


  const [account, setAccount] = useState()
  const [ethBalance, setEthBalance] = useState(0)
  const [token, setToken] = useState()
  const [tokenBalance, setTokenBalance] = useState()
  const [ethSwap, setEthSwap] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function initWeb3() {
      await loadWeb3()
      await loadBlockChainData()
    }

    initWeb3()

    return () => { }
  }, [])


  async function loadWeb3() {
    if (window.etherium) {
      window.web3 = new Web3(window.etherium)
      await window.etherium.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Non-Etherium browser. Try Metamask")
    }
  }

  async function loadBlockChainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const ethBalance = await web3.eth.getBalance(account)
    setEthBalance(ethBalance)

    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      setToken(new web3.eth.Contract(Token.abi, tokenData.address))
      let tokenBalance = await token.methods.balanceOf(account).call()
      setTokenBalance(tokenBalance)
    } else {
      window.alert("Token Contract not deployed to network")
    }

    const ethSwapData = EthSwap.networks[networkId]
    if (ethSwapData) {
      setEthSwap(new web3.eth.Contract(EthSwap.abi, ethSwapData.address))
    } else {
      window.alert("EthSwap Contract not deployed to network")
    }
  }

  async function buyTokens(etherAmount) {
    setLoading(true)
    try {
      await ethSwap.methods.buyTokens()
        .send({ from: account, value: etherAmount })
        .on('transactionHash', () => {
          setLoading(false)
          window.alert("Tokens bought successfully!")
        })
    } catch (error) {
      console.log(error)
      window.alert("Tokens cannot be bought!")
    }
  }

  async function sellTokens(tokenAmount) {
    setLoading(true)

    try {
      await token.methods.approve(ethSwap.address, tokenAmount)
        .send({ from: account })
        .on('transactionHash', async () => {
          await token.methods.sellTokens(tokenAmount)
            .send({ from: account })
            .on('transactionHash', () => {
              setLoading(false)
              window.alert("Tokens sold successfully!")
            })
        })
    } catch (error) {
      console.log(error)
      window.alert("Tokens cannot be sold!")
    }
  }

  let content
  if (loading) {
    content = <p id="loader" className="text-center">Loading...</p>
  } else {
    content = <Main
      ethBalance={ethBalance}
      tokenBalance={tokenBalance}
      buyTokens={buyTokens}
      sellTokens={sellTokens}
    />
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
