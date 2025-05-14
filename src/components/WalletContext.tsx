// src/components/WalletContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface WalletContextType {
  address?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>();

  // Rehydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("walletAddress");
    if (stored) setAddress(stored);

    // Listen for account changes
    (window as Window & typeof globalThis & { ethereum?: { on: (event: string, callback: (accounts: string[]) => void) => void } }).ethereum?.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length) {
        setAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
      } else {
        setAddress(undefined);
        localStorage.removeItem("walletAddress");
      }
    });
  }, []);

  const connect = async () => {
    interface Ethereum {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
    }

    if (!(window as Window & typeof globalThis & { ethereum?: Ethereum }).ethereum) {
      alert("Install MetaMask");
      return;
    }
    if (!window.ethereum) {
      throw new Error("Ethereum object is not available on the window.");
    }
    const [acc] = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
    setAddress(acc);
    localStorage.setItem("walletAddress", acc);
  
    // **Upsert the user profile in Prisma**
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: acc }),
      });
    } catch (err) {
      console.error("Failed to upsert user:", err);
    }
  };

  const disconnect = () => {
    setAddress(undefined);
    localStorage.removeItem("walletAddress");
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
