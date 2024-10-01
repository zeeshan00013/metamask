import React, { useState } from 'react';
import { ethers } from 'ethers';
import { FaWallet, FaEthereum, FaSpinner } from 'react-icons/fa';
import { Network, Alchemy } from "alchemy-sdk";

function Token() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenBalances, setTokenBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [bulkRecipients, setBulkRecipients] = useState([{ address: '', amount: '' }]);

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
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });

        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        await ethProvider.send('eth_requestAccounts', []);

        const ethSigner = ethProvider.getSigner();
        const userAccount = await ethSigner.getAddress();
        setAccount(userAccount);
        await fetchEthBalance(ethSigner, userAccount);
        await fetchTokenBalances(userAccount);
      } catch (error) {
        console.error(error);
        setError('Error connecting to MetaMask');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenBalances([]);
    setEthBalance('0');
    setBulkRecipients([{ address: '', amount: '' }]);
    setSelectedToken(null);
  };

  const fetchEthBalance = async (signer, account) => {
    const balance = await signer.getBalance();
    setEthBalance(ethers.utils.formatEther(balance));
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
    "function transfer(address to, uint256 amount) returns (bool)",
  ];

  const transferTokensInBulk = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!selectedToken) {
      alert("Please select a token first!");
      return;
    }

    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const tokenContract = new ethers.Contract(selectedToken.contractAddress, erc20ABI, signer);

      const recipients = bulkRecipients.map((recipient) => ({
        address: recipient.address,
        amount: ethers.utils.parseUnits(recipient.amount.toString(), 18), // Assuming 18 decimals
      }));

      const recipientAddresses = recipients.map(r => r.address);
      const amounts = recipients.map(r => r.amount);

      // Perform bulk transfer
      const tx = await tokenContract.transferInBulk(recipientAddresses, amounts);
      await tx.wait(); // Wait for transaction to be mined

      alert("Bulk transfer successful!");
      setSelectedToken(null); // Reset selected token after transfer
      setBulkRecipients([{ address: '', amount: '' }]); // Reset recipient fields
    } catch (error) {
      console.error("Bulk transfer error:", error);
      alert("Bulk transfer failed. Please try again.");
    }
  };

  const addRecipientField = () => {
    setBulkRecipients([...bulkRecipients, { address: '', amount: '' }]);
  };

  const handleRecipientChange = (index, field, value) => {
    const updatedRecipients = [...bulkRecipients];
    updatedRecipients[index][field] = value;
    setBulkRecipients(updatedRecipients);
  };

  return (
    <div className="h-screen w-full px-9 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center text-white">
      <div className="w-full rounded-lg shadow-2xl  flex flex-col py-10 items-center">
        <div className="flex justify-center mb-3">
          <FaWallet className="text-4xl text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center">Wallet Info</h1>

        {error && (
          <p className="text-emerald-400 text-center font-bold mb-4">{error}</p>
        )}

        {account ? (
          <>
            <h2 className="text-xl mb-2">Connected Account: <span className="text-green-400">{account}</span></h2>
            <h3 className="text-lg mb-2">
              <FaEthereum className="inline-block mr-2" />
              ETH Balance: {ethBalance} ETH
            </h3>
            <h3 className="text-lg font-bold mb-2">Your Tokens:</h3>
            <ul className="bg-gray-700 p-4 rounded w-[70%] px-20">
              {tokenBalances.length > 0 ? (
                tokenBalances.map((token, index) => (
                  <li key={index} className="flex justify-between ">
                    <strong className='text-emerald-500 text-xl'>{token.tokenSymbol}:</strong>
                    <span className='font-bold text-gray-400 '>{token.tokenBalance}</span>
                    <button 
                      onClick={() => setSelectedToken(token)} 
                      className="text-emerald-500 font-bold underline hover:underline ml-2 hover:text-emerald-300"
                    >
                      Select
                    </button>
                  </li>
                ))
              ) : (
                <p>No ERC-20 tokens found</p>
              )}
            </ul>

            {selectedToken && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2 text-emerald-500">Send {selectedToken.tokenSymbol} in Bulk:</h3>
                {bulkRecipients.map((recipient, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={recipient.address}
                      onChange={(e) => handleRecipientChange(index, 'address', e.target.value)}
                      className="p-2 mb-2 w-full bg-gray-700 text-white rounded"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={recipient.amount}
                      onChange={(e) => handleRecipientChange(index, 'amount', e.target.value)}
                      className="p-2 mb-2 w-full bg-gray-700 text-white rounded"
                    />
                  </div>
                ))}
                <button
                  onClick={addRecipientField}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 mb-4"
                >
                  Add Another Recipient
                </button>
                <button
                  onClick={transferTokensInBulk}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Send Tokens in Bulk
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 mb-4 text-center">Please connect your wallet</p>
        )}

        {account ? (
          <button
            onClick={disconnectWallet}
            className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center mt-4"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className={`p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Token;
