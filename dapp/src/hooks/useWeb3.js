import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
        try {
          if (window.ethereum) {
            const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await ethProvider.send("eth_requestAccounts", []);
            setProvider(ethProvider);
            setSigner(ethProvider.getSigner());
            setAccount(accounts[0]);
          } else {
            alert('Please install MetaMask!');
          }
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      };
    connectWallet();
  }, []);

  return { provider, signer, account };
};
