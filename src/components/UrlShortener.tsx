// src/components/UrlShortener.tsx
"use client";
import { useState } from "react";
import { ClipboardIcon, LinkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import idl from "@/idl/registry.json";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  function generateShortCode(len = 7) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: len }, () => chars.charAt(Math.random() * chars.length | 0)).join("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);

    if (!longUrl) {
      setError("Please enter a URL"); setIsLoading(false); return;
    }
    try { new URL(longUrl); } catch {
      setError("Invalid URL"); setIsLoading(false); return;
    }
    if (!wallet.connected) {
      setError("Connect your wallet"); setIsLoading(false); return;
    }

    const shortCode = generateShortCode();
    try {
      // 1) Upload to IPFS via our serverless API
      const res = await fetch("/api/ipfs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ short: shortCode, url: longUrl }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("IPFS API Error:", text);
        throw new Error("IPFS upload failed");
      }
      const { cid, error: ipfsErr } = await res.json();
      if (ipfsErr) throw new Error(ipfsErr);

      // 2) Register on Solana using new Anchor methods API
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { preflightCommitment: "processed", commitment: "processed", skipPreflight: false }
      );
      const program = new Program(idl, idl.metadata.address, provider);

      // use .methods.register instead of legacy rpc
      await program.methods
        .register(shortCode, Array.from(Buffer.from(cid)))
        .accounts({ authority: wallet.publicKey!, systemProgram: SystemProgram.programId })
        .rpc();

      setShortUrl(`https://${window.location.host}/${shortCode}`);
    } catch (err: any) {
      console.error("Shorten Error:", err);
      setError(err.message.includes("IPFS") ? "IPFS upload failed." : "Solana registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto p-4 pt-0">
      <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end opacity-20 dark:opacity-10 blur-3xl animate-blob" />
      <div className="relative rounded-3xl p-8 shadow-2xl border border-black">
        <div className="flex items-center gap-3 mb-8">
          <SparklesIcon className="h-8 w-8 text-neon-blue" aria-hidden="true" />
          <h2 className="text-4xl font-bold">Shorten Magic</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              id="url-input"
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter URL to shorten..."
              className="w-full p-5 rounded-xl bg-white/70 border-2 focus:ring-0 pr-14 text-lg"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "url-error" : undefined}
            />
            <LinkIcon className="h-6 w-6 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            {error && <p id="url-error" className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-5 rounded-xl cursor-pointer font-bold text-lg border-2 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            aria-label="Create shortened URL"
          >
            <SparklesIcon className="h-6 w-6" aria-hidden="true" />
            {isLoading ? "Shortening..." : "Create Magic Link"}
          </button>
        </form>
        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <a href={shortUrl} target="_blank" rel="noopener" className="font-mono text-blue-600">
              {shortUrl}
            </a>
            <button onClick={() => navigator.clipboard.writeText(shortUrl)}>
              <ClipboardIcon className="h-6 w-6 text-purple-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
