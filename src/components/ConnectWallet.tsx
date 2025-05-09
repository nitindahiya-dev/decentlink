// src/components/ConnectWallet.tsx
"use client";

import dynamic from "next/dynamic";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Dynamically import the WalletMultiButton to avoid SSR mismatches
const WalletMultiButton = dynamic<{}>(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC!;

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter({ params: { network } }),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function ConnectWalletButton() {
  return <WalletMultiButton />;
}
