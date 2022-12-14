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
  //Stroing waves
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("")

  //variable for contractAddress
  const contractAddress = "0xf77d28b0ecE51DB25da523B4246292F6128C002D"
  //variable for contractABI
  const contractABI = abi.abi;

  const getAllWaves = async() => {
      const {ethereum} = window;
    
    try {
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const waveMePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        //calling getAllWaves method
        const waves = await waveMePortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });
        setAllWaves(wavesCleaned)
        // console.log(wavesCleaned)
      }else{
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Listen in for emitter events!
  useEffect(() => {
    let waveMePortalContract;

    const onNewWave =(from, timestamp ,message) => {
      console.log(from, timestamp ,message)
      setAllWaves(prevState => [...prevState, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      },])
    }

    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      waveMePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      waveMePortalContract.on("NewWave", onNewWave)
    }

    return () => {
      if(waveMePortalContract){
        waveMePortalContract.off("NewWave", onNewWave)
      }
    }
  }, [])

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

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      console.log(currentAccount)
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

        //Setting gas limit & passing the message
        const waveTxn = await waveMePortalContract.wave(message, { gasLimit: 300000 })
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
    if(account == null){
      console.error("Some thing wrong with the account")
    }
    setCurrentAccount(account)
  },[])

  const handleInput = (e) => {
    
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    getAllWaves();
    wave();
  }
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        ???? Hey there!
        </div>

        <div className="bio">
        I am Harsh Chauhan, a Full Stack Developer from India.
          <br/>Fun Fact ????: A minute is enough for me to solve a Rubik's Cube.
        <br/>Connect your Ethereum wallet and wave at me!
        </div>

        {!count || count === 0 ? (<p className="para">Total????: ?, <span className="highligted-text"> Please Connect your wallet ->  Add a comment -> Wave at me ????</span></p>) : (<div className="stats">
          <h3>Total ????: {count}</h3>
        </div>)}
        
        {!currentAccount ? (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet ???? ????
          </button> 
        ): (
      <form className="form" onSubmit={handleFormSubmit}>
        <input className="input" type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Comment Something!"/>
        <button className="waveButton">
          Wave at Me ????
        </button>
      </form>)}
        {/*
         * If there is no currentAccount render this button
         */}
        

        <div>
          <h2 className="stats">All ????</h2>
        {allWaves.map((wave, index) => {
          return(
            <div key={index} style={{ backgroundColor: "rgb(56,58,89)", marginTop: "16px", padding: "8px", borderRadius: "10px" }}>
              <div><span className="highligted-text">Address:</span> <span className="para">{wave.address}</span>                     </div>
              <div><span className="highligted-text">Time:</span> <span className="para">{wave.timestamp.toString()}                  </span></div>
              <div><span className="highligted-text">Message:</span> <span className="para">{wave.message}</span>                     </div>
              
            </div>)
        })}
          </div>
      </div>
    </div>
  );
}
