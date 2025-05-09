// src/components/Header.tsx
"use client";

import Link from "next/link";

// 1) Import the adapter-react-ui CSS exactly once in your app (you can also do this in _app.tsx or layout.tsx)
import "@solana/wallet-adapter-react-ui/styles.css";

import { ConnectWalletButton } from "./ConnectWallet";

export default function Header() {
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
            <li>
              <Link href="/analytics" className="hover:underline text-secondary">
                Analytics
              </Link>
            </li>
          </ul>
          {/* 2) Now the ConnectWalletButton will show the Phantom icon and open the modal */}
          <ConnectWalletButton />
        </nav>
      </div>
    </header>
  );
}
