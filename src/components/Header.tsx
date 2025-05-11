// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useWalletContext } from "../components/WalletContext";

export default function Header() {
  const { address, connect, disconnect } = useWalletContext();

  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent">
          <Link href="/">SillyLink</Link>
        </h1>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline text-secondary">
                Home
              </Link>
            </li>
            {address && (
              <li>
                <Link href="/analytics" className="hover:underline text-secondary">
                  Analytics
                </Link>
              </li>
            )}
          </ul>

          {address ? (
            <button onClick={disconnect} className="cursor-pointer hover:underline text-secondary">
              {address.slice(0, 6)}…{address.slice(-4)} (Disconnect)
            </button>
          ) : (
            <button onClick={connect} className="cursor-pointer hover:underline text-secondary">
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
