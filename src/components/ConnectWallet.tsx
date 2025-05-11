"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function ConnectWallet() {
  const [address, setAddress] = useState<string>();

  async function connect() {
    if (!(window as any).ethereum) return alert("Install MetaMask");
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    setAddress(await signer.getAddress());
  }

  return (
    <button onClick={connect} className="btn">
      {address ? address.slice(0,6)+"…"+address.slice(-4) : "Connect Wallet"}
    </button>
  );
}
