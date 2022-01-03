
import './App.css';
import {useState,useEffect} from "react";
import pickRandom from 'pick-random';
import nftMintArray from "./nfts.json"
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
function App() {
    const [countMint,setCountMint]=useState(0);
    const contractAddress="0xA372E86B0a3E7F3bb80490Fc72Cc1Fe2CeD407D7";
    const whitelist=[
"0xCDeF3CC7cDBdC8695674973Ad015D9f2B01dD4C4",
"0xCDeF3CC7cDBdC8695674973Ad015D9f2B01dD4C4"
];
const normalPrice="0.02";
const whitelistedPrice="0.01";
  useEffect(()=>{
      let count=0;
    const arrow = document.querySelector(".arrow")
const plusBtn = document.querySelector(".plus")
const countNumber = document.querySelector(".count-number")
const minusBtn = document.querySelector(".minus")
const hamburgerBtn = document.querySelector(".hamburger-menu")
const aside = document.querySelector(".sidebar")
const closeBtn = document.querySelector(".close")
const switchBc = document.querySelector(".background-switch")
const mainImg = document.querySelector(".main-img")
const avatars = document.querySelectorAll(".avatar img")

let switchCount = 0

arrow.addEventListener('click', () => {
    window.scrollTo(0, document.documentElement.clientHeight + 10)
})

hamburgerBtn.addEventListener('click', () => {
    aside.style.transform = "translateX(0px)"
})

closeBtn.addEventListener('click', () => {
    aside.style.transform = "translateX(-10000px)"
})

switchBc.addEventListener('click', () => {
    if (switchCount === 0) {
        switchBc.style.backgroundImage = "url('img/swtichOn.png')"
        mainImg.src = 'img/bg.jpg'
        switchCount++
    } else {
        switchBc.style.backgroundImage = "url('img/switchOff.png')"
        mainImg.src = 'img/bg-dark.jpg'
        switchCount--
    }
})

plusBtn.addEventListener('click', () => {
    count++;
    setCountMint(count);
    let temp = count
    countNumber.innerHTML = count
    minusBtn.disabled = false
    minusBtn.classList.remove("opacity")
    if (count === 10) {
        plusBtn.classList.add("opacity")
        plusBtn.disabled = true
    }
    switch (temp) {
        case 1:
            avatars[0].style.left = "0"
            break;
        case 2:
            avatars[9].style.left = "-220px"
            break;
        case 3:
            avatars[1].style.right = "96px"
            break;
        case 4:
            avatars[8].style.left = "-140px"
            break;
        case 5:
            avatars[2].style.right = "190px"
            break;
        case 6:
            avatars[7].style.left = "-60px"
            break;
        case 7:
            avatars[3].style.right = "276px"
            break;
        case 8:
            avatars[6].style.left = "20px"
            break;
        case 9:
            avatars[4].style.right = "360px"
            break;
        default:
            avatars[5].style.left = "100px"
            break;
    }
})

minusBtn.addEventListener("click", () => {
    let temp = count
    if (count != 1) {
        count--
        setCountMint(count);
        countNumber.innerHTML = count
        plusBtn.classList.remove("opacity");
        plusBtn.disabled = false;
    } else {
        minusBtn.disabled = true
        minusBtn.classList.add("opacity")
    }

    if (count === 0) {
        minusBtn.disabled = true
        minusBtn.classList.add("opacity")
    }
    switch (temp) {
        case 1:
            avatars[0].style.right = "1000"
            break;
        case 2:
            avatars[9].style.left = "1000px"
            break;
        case 3:
            avatars[1].style.right = "1000px"
            break;
        case 4:
            avatars[8].style.left = "1000px"
            break;
        case 5:
            avatars[2].style.right = "1000px"
            break;
        case 6:
            avatars[7].style.left = "1000px"
            break;
        case 7:
            avatars[3].style.right = "1000px"
            break;
        case 8:
            avatars[6].style.left = "1000px"
            break;
        case 9:
            avatars[4].style.right = "1000px"
            break;
        case 10:
            avatars[5].style.left = "1000px"
            break;
    }
})
  },[])
  

  const [nftData,setNftData]=useState();
  const [contractData,setContractData]=useState();
  const walletConnect=async()=>{
    try{
       const account= await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider=window.ethereum;
        const userWallet=account[0];
        const web3 = new Web3(window.ethereum);
        const abiMIN=[{
            "inputs": [],
            "name": "totalMint",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "maxMint",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              { "internalType": "address", "name": "player", "type": "address" },
              { "internalType": "string[]", "name": "tokenURI", "type": "string[]" }
            ],
            "name": "awardItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ];
        let contract = new web3.eth.Contract(abiMIN,contractAddress);
        const totalMint=await contract.methods.totalMint().call();
        const maxMint=await contract.methods.maxMint().call();
        setContractData({totalMint,maxMint});
        setNftData({
          provider,
          userWallet,
          contract
        })
      }
      catch(err){
  
      }
  }

  const mintHandler=async()=>{
      
    const toMint=pickRandom(nftMintArray,{count: countMint});
    try{
        if(!nftData){
            await walletConnect();
        }
        if(!(countMint>0)){
            throw true;
        }
      const tx=await nftData.contract.methods.awardItem(nftData.userWallet,toMint).send({from:nftData.userWallet,value:(countMint*Web3.utils.toWei(
        (whitelist.filter(v=>v.toUpperCase()==nftData.userWallet.toUpperCase()).length>0)?whitelistedPrice:normalPrice, 'ether'))});
      if(tx){
        toast.success('Done', {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
          });
   
      }
    }
     catch(err){
      toast.error('Someting went wrong!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

    
  }
  useEffect(()=>{
    walletConnect();
  },[])
  return (
   <>
   <ToastContainer />
   <header class="Main-header">
      <div class="container">
          <div class="Header-logo">
              <img src="img/logo.png"/>
          </div>
          <div class="Header-menu">
              <div class="background-switch">
              </div>
              <nav class="menu-user">
              <a href="https://undefeatedsamurai.com/#home" target="_blank" class="menu-user-item active">Home</a>
                    <a href="https://undefeatedsamurai.com/#story" target="_blank" class="menu-user-item">Story</a>
                    <a href="https://undefeatedsamurai.com/#roadmap" target="_blank" class="menu-user-item">Roadmap</a>
                    <a href="https://undefeatedsamurai.com/#whitepaper" target="_blank" class="menu-user-item">White Paper</a>
                    <a href="https://opensea.io/" class="menu-user-item">Opensea</a>
                  <button class="menu-user-button" onClick={walletConnect}>{nftData?nftData.userWallet:"Connect"}  </button>
                  <button class="hamburger-menu">
                      <img src="img/hamburger.png" alt=""/>
                  </button>
              </nav>
          </div>
      </div>
      <aside class="sidebar">
          <div class="Header-logo">
              <img src="img/logo.png"/>
          </div>
          <div class="Header-menu">
              <nav class="menu-user">
              <a href="https://undefeatedsamurai.com/#home" target="_blank" class="menu-user-item active">Home</a>
                  <a href="https://undefeatedsamurai.com/#story" target="_blank" class="menu-user-item">Story</a>
                  <a href="https://undefeatedsamurai.com/#roadmap" target="_blank" class="menu-user-item">Roadmap</a>
                  <a href="https://undefeatedsamurai.com/#whitepaper" target="_blank" class="menu-user-item">White Paper</a>
                  <a href="https://opensea.io/" class="menu-user-item">Opensea</a>
                  <button class="menu-user-button" onClick={walletConnect}>{nftData?nftData.userWallet:"Connect"}  </button>
              </nav>
          </div>
          <div class="close">
              <img src="img/close.svg" alt=""/>
          </div>
      </aside>
  </header>
  <div class="main-backgroundimage">
      <img src="img/bg-dark.jpg" class="main-img"/>
      <div class="arrow">
          <img src="img/arrow.svg" alt=""/>
      </div>
  </div>
  <main class="Main">
      <section class="Main-aboutUs">
          <div class="container">
              <div class="article">
                  <div class="title">Meet The Undefeated Samurai</div>
                  <p class="text"><span class="bold">Undefeated Samurai</span> is a collection of 3,000 unique, NFTs, that are all different stats and outlook Undefeated Samurai is on ERC-721. All of them are unique, but some are simply legendary. You can check the Rarity Ranking & Distribution below for the details!</p>
              </div>
              <div class="video">
                  <video width="500" height="332" controls>
                      <source src="movie.mp4" type="video/mp4"/>
                      <source src="movie.ogg" type="video/ogg"/>
                  </video>
              </div>
          </div>
      </section>
      <section class="Main-mint">
          <div class="container">
              <div class="title">You don't want to miss out, mint your <span class="bold">Undefeated Samurai while you can</span></div>
              <div class="stock">
                  <span class="number">{contractData?.totalMint} / {contractData?.maxMint} </span>
                  
              </div>
              <div class="sales">
                  <div class="count">
                      <button class="minus opacity" disabled>-</button>
                      <span class="count-number">0</span>
                      <button class="plus">+</button>
                  </div>
                  <button class="sales-btn" onClick={mintHandler}>MINT</button>
              </div>
              <div class="description">The remaining ones are for airdroppers!</div>
          </div>
      </section>
      <div class="avatar">
          <div class="left">
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
          </div>
          <div class="right">
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
              <img src="img/avatar.png" />
          </div>
      </div>
  </main>

   </>
  );
}

export default App;
