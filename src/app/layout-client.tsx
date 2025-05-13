"use client";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { WalletProvider } from "../components/WalletContext";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "SillyLink",
  description: "Web3 URL Shortener on Ethereum + IPFS",
};

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </WalletProvider>
  );
}
