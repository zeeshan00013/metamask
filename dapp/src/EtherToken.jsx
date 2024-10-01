import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Replace with your contract ABI and deployed contract address
const contractAbi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "EtherSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "token", "type": "address" }
    ],
    "name": "TokenSent",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getEtherBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }],
    "name": "getTokenBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address payable", "name": "_to", "type": "address" }],
    "name": "sendEther",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_token", "type": "address" },
      { "internalType": "address", "name": "_to", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "sendTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Replace with your deployed contract address
const contractAddress = '0x9ba774F3a1A0d27cc886921ddc859B73abcF0d9E'; 
const tokenAddress = '0x9ba774F3a1A0d27cc886921ddc859B73abcF0d9E'; // Replace with your token contract address

const EtherToken = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          await ethProvider.send('eth_requestAccounts', []);
          const ethSigner = ethProvider.getSigner();
          setProvider(ethProvider);
          setSigner(ethSigner);
          const userAccount = await ethSigner.getAddress();
          setAccount(userAccount);

          // Initialize the contract
          const etherTokenContract = new ethers.Contract(contractAddress, contractAbi, ethSigner);
          setContract(etherTokenContract);
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    };

    connectWallet();
  }, []);

  const handleSendEther = async () => {
    try {
      const tx = await contract.sendEther(recipient, { value: ethers.utils.parseEther(amount) });
      console.log('Transaction sent:', tx);
      await tx.wait(); // Wait for confirmation
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error sending Ether:', error);
    }
  };

  const handleSendTokens = async () => {
    try {
      const tx = await contract.sendTokens(tokenAddress, recipient, ethers.utils.parseUnits(amount, 18)); // Adjust decimals as needed
      console.log('Transaction sent:', tx);
      await tx.wait(); // Wait for confirmation
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error sending tokens:', error);
    }
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Ether and Token Sender</h1>
        <p className="text-center text-gray-600 mb-4">Your Address: {account || 'Not connected'}</p>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in Ether or Tokens"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={handleSendEther}
          disabled={!contract || !account || !recipient || !amount}
          className={`mb-4 p-2 rounded w-full text-white ${(!contract || !account || !recipient || !amount) ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
        >
          Send Ether
        </button>
        <button
          onClick={handleSendTokens}
          disabled={!contract || !account || !recipient || !amount}
          className={`p-2 rounded w-full text-white ${(!contract || !account || !recipient || !amount) ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} transition duration-300`}
        >
          Send Tokens
        </button>
      </div>
    </div>
  );
};

export default EtherToken;
