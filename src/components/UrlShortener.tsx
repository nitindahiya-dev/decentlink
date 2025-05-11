"use client";
import { useState } from "react";
import { ClipboardIcon, LinkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { registryContract } from "../utils/ethers";
import { ethers } from "ethers";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const BASE = process.env.NEXT_PUBLIC_BASE_URL!;

  // Check for Ethereum wallet (e.g., MetaMask)
  const hasWallet = typeof window !== "undefined" && window.ethereum;

  function genCode(len = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: len }, () => chars.charAt(Math.random() * chars.length | 0)).join("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate URL
    if (!longUrl) {
      setError("Please enter a URL");
      setIsLoading(false);
      return;
    }
    try {
      new URL(longUrl);
    } catch {
      setError("Invalid URL");
      setIsLoading(false);
      return;
    }

    // Check wallet connection
    if (!hasWallet) {
      setError("Please connect an Ethereum wallet (e.g., MetaMask)");
      setIsLoading(false);
      return;
    }

    const code = genCode();
        try {
      // Upload to IPFS
      const res = await fetch("/api/ipfs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ short: code, url: longUrl }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "IPFS upload failed");
      }
      const { cid } = await res.json();
      if (!cid || typeof cid !== "string") {
        throw new Error("Invalid CID returned from IPFS");
      }

      // Register on Ethereum
      const codeBytes = ethers.utils.toUtf8Bytes(code).slice(0, 6);
      const cidBytes = ethers.utils.toUtf8Bytes(cid);
      const tx = await registryContract.register(codeBytes, cidBytes);
      await tx.wait();

      setShortUrl(`${BASE}/${code}`);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Error shortening URL");
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
            <LinkIcon
              className="h-6 w-6 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            {error && (
              <p id="url-error" className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
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
              <ClipboardIcon className="h-6 w-6 text-purple-600 cursor-pointer" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}