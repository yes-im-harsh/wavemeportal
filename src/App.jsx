import React,{useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';

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

  useEffect(async() => {
    const account = await findMetamaskAccount()
    if(account !== null){setCurrentAccount(account)}
   
  },[])
  

  const wave = () => {
    
  }
  
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

        <button className="waveButton" onClick={wave}>
          Wave at Me 👋
        </button>
      </div>
    </div>
  );
}
