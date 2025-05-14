"use client";

import { useState } from "react";
import { ethers } from "ethers";

// Declare window.ethereum type
interface Ethereum {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

// Extend ethers ExternalProvider to match window.ethereum
interface ExternalProvider extends Ethereum {
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  providers?: ExternalProvider[];
}

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

export function ConnectWallet() {
  const [address, setAddress] = useState<string | undefined>();

  async function connect() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setAddress(await signer.getAddress());
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet");
    }
  }

  return (
    <button onClick={connect} className="btn">
      {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}
