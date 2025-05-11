// src/components/WalletContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletContextType {
  address?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    if ((window as any).ethereum?.selectedAddress) {
      setAddress((window as any).ethereum.selectedAddress);
    }
  }, []);

  const connect = async () => {
    if (!(window as any).ethereum) return alert("Install MetaMask");
    const [acc] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    setAddress(acc);
    // No Web2 call—pure on-chain
  };

  const disconnect = () => {
    setAddress(undefined);
  };

  return (
    <WalletContext.Provider value={{ address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used within WalletProvider");
  return ctx;
}
