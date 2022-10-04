import React,{useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WaveMePortal.json";

const getEthereumObject = () => window.ethereum;

const findMetamaskAccount = async() => {
  try {
    const ethereum = getEthereumObject()

  if(!ethereum) {
    console.log("Make sure you have metamask!")
  }

  console.log("We have Ethereum Object", ethereum)
  const accounts = await ethereum.request({method: "eth_accounts"})

  if(accounts.length !== 0){
    const account = accounts[0]
    console.log("Found an authorized account:", account)
    return account
  } else {
    console.log("Not authorized account found")
    return null
  }
  } catch (error) {
    console.error(error);
    return null;
  }
  
}

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("")
  const [count, setCount] = useState(0)

  //variable for contractAddress
  const contractAddress = "0xC942C55eB12a21dC8E7eB5752294C572E9b1DDe5"
  //variable for contractABI
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", account[0]);
      setCurrentAccount(account[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveMePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await waveMePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await waveMePortalContract.wave()
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        console.log("Mined--", waveTxn.hash)

        count = await waveMePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber());
        setCount(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

  useEffect(async() => {
    const account = await findMetamaskAccount()
    if(account !== null){setCurrentAccount(account)}
   
  },[])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Harsh Chauhan, a Full Stack Developer from India.
          <br/>Fun Fact 🤯: A minute is enough for me to solve a Rubik's Cube.
        <br/>Connect your Ethereum wallet and wave at me!
        </div>

        {!count || count === 0 ? (<p className="para">Wan to know Total👋? <span className="highligted-text"> Then Wave at me 😀</span></p>) : (<div className="stats">
          <h3>Total 👋: {count}</h3>
        </div>)}
        

        <button className="waveButton" onClick={wave}>
          Wave at Me 👋
        </button>
        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet 🔐
          </button>
        )}
      </div>
    </div>
  );
}
