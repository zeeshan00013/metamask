// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import MehdiTechnologyAbi from "./contracts/MehdiTechnology.json"; // Ensure you have your contract's ABI

// const contractAddress = '0xd1bd27c9bE2943e8ec0ce43d6F8B8f9Ce434EEb7'; // Replace with your contract address

// function TokenSender() {
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');

//   const sendTokens = async () => {
//     if (!recipient || !amount) {
//       alert("Recipient and amount are required!");
//       return;
//     }

//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const tokenContract = new ethers.Contract(contractAddress, MehdiTechnologyAbi, signer);

//       const tx = await tokenContract.transfer(recipient, ethers.utils.parseUnits(amount, 18)); // Assuming 18 decimals
//       console.log('Transaction sent:', tx);
//       await tx.wait(); // Wait for confirmation
//       console.log('Transaction confirmed:', tx.hash);
//     } catch (error) {
//       console.error('Error sending tokens:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Send Mehdi Technology Tokens</h1>
//       <input
//         type="text"
//         placeholder="Recipient Address"
//         value={recipient}
//         onChange={(e) => setRecipient(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <button onClick={sendTokens}>Send Tokens</button>
//     </div>
//   );
// }

// export default TokenSender;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EtherSenderAbi from "./contracts/EtherSenderAbi.json"; // Make sure the ABI file path is correct

const contractAddress = '0x9ba774F3a1A0d27cc886921ddc859B73abcF0d9E'; // Replace with your deployed contract address on Sepolia

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
          const etherSender = new ethers.Contract(contractAddress, EtherSenderAbi.abi, ethSigner);
          setContract(etherSender);
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    };

    connectWallet();
  }, []);

  const switchAccount = async () => {
    if (provider) {
      try {
        // Request accounts again to allow the user to switch accounts
        await provider.send('eth_requestAccounts', []);
        const ethSigner = provider.getSigner(); // Get the updated signer
        const userAccount = await ethSigner.getAddress(); // Get the new account address
        setAccount(userAccount); // Update account state
        console.log('Switched to account:', userAccount);
      } catch (error) {
        console.error('Error switching account:', error);
      }
    }
  };

  const sendEther = async (recipientAddress, amountInEther) => {
    setLoading(true); // Set loading state
    setErrorMessage(''); // Reset error message
    try {
      // Input validation
      if (!recipientAddress || !ethers.utils.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      if (!amountInEther || isNaN(amountInEther) || Number(amountInEther) <= 0) {
        throw new Error('Amount must be a valid positive number');
      }

      const tx = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amountInEther.toString()), // Convert amount to wei
        gasLimit: ethers.utils.hexlify(100000), // Set gas limit
      };

      const transaction = await signer.sendTransaction(tx);
      console.log('Transaction sent:', transaction);
      setTransactionHash(transaction.hash); // Store the transaction hash
      await transaction.wait(); // Wait for confirmation
      console.log('Transaction confirmed:', transaction.hash);
      // Reset inputs after successful transaction
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Error sending Sepolia ETH:', error);
      setErrorMessage(error.message); // Set error message to be displayed
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Ether Sender on Sepolia</h1>
        <p className="text-gray-600 mb-4 text-center">Your Address: {account || 'Not connected'}</p>
        {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}
        {transactionHash && <p className="text-green-600 text-center mb-4">Transaction Hash: {transactionHash}</p>}
        
        <div className="mb-4">
          <button
            onClick={switchAccount} // Call switchAccount on button click
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-4"
          >
            Switch Account
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number" // Changed to number type
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // Capture user input
            placeholder="Enter amount in Sepolia ETH"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => sendEther(recipient, amount)} // Pass parameters correctly
          disabled={!contract || !account || !recipient || !amount || loading} // Disable button if fields are empty or loading
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Sending...' : 'Send Ether'}
        </button>
      </div>
    </div>
  );
}

export default App;
