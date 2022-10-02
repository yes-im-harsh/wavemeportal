import React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

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
