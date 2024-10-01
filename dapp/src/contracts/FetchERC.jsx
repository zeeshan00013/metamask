import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Alchemy, Network } from "alchemy-sdk";
import { FaWallet, FaEthereum, FaSpinner } from 'react-icons/fa';

function TokenBalance() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenBalances, setTokenBalances] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Alchemy settings for Sepolia testnet (update with your API key)
  const settings = {
    apiKey: "NQLLINSSXhjzWxhgI7R2MjYNcNs4ipDh", // Replace with your Alchemy API Key
    network: Network.ETH_SEPOLIA,
  };

  const alchemy = new Alchemy(settings);

  const connectWallet = async () => {
    if (window.ethereum) {
      setLoading(true);
      setError('');
      try {
        // Request account access from MetaMask

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAccount = await signer.getAddress();
        setAccount(userAccount);

        // Fetch Ethereum balance
        const balance = await signer.getBalance();
        setEthBalance(ethers.utils.formatEther(balance));

        // Fetch dynamic token balances using Alchemy
        await fetchTokenBalances(userAccount);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError('Error connecting to wallet. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const fetchTokenBalances = async (address) => {
    try {
      const balances = await alchemy.core.getTokenBalances(address);
      const nonZeroBalances = balances.tokenBalances.filter(token => token.tokenBalance !== "0");

      const formattedBalances = await Promise.all(
        nonZeroBalances.map(async (token) => {
          const tokenContract = new ethers.Contract(token.contractAddress, erc20ABI, new ethers.providers.Web3Provider(window.ethereum));
          const symbol = await tokenContract.symbol();
          const decimals = await tokenContract.decimals();
          const formattedBalance = ethers.utils.formatUnits(token.tokenBalance, decimals);

          return {
            contractAddress: token.contractAddress,
            tokenSymbol: symbol,
            tokenBalance: formattedBalance,
          };
        })
      );

      setTokenBalances(formattedBalances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setError('Error fetching token balances. Please try again.');
    }
  };

  const erc20ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">My dApp</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        
        {account ? (
          <>
            <h2 className="text-xl mb-2">Connected Account: <span className="text-green-400">{account}</span></h2>
            <h3 className="text-lg mb-2">
              <FaEthereum className="inline-block mr-2" />
              ETH Balance: {ethBalance} ETH
            </h3>
            <h3 className="text-lg font-bold mb-2">Your Tokens:</h3>
            <ul className="bg-gray-700 p-4 rounded w-full">
              {tokenBalances.length > 0 ? (
                tokenBalances.map((token, index) => (
                  <li key={index} className="flex justify-between">
                    <strong>{token.tokenSymbol}:</strong>
                    <span>{token.tokenBalance}</span>
                  </li>
                ))
              ) : (
                <p>No ERC-20 tokens found</p>
              )}
            </ul>
          </>
        ) : (
          <button
            onClick={connectWallet}
            className={`w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <FaWallet className="mr-2" />
                Connect Wallet
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default TokenBalance;
