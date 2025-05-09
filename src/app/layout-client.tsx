// src/app/layout-client.tsx
"use client";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SolanaProvider } from "../components/ConnectWallet";

export const metadata = {
  title: "SillyLink",
  description: "Web3 URL Shortener on Solana + IPFS",
};

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SolanaProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SolanaProvider>
  );
}
