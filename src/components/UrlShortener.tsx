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

  const hasWallet = typeof window !== "undefined" && window.ethereum;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  function genCode(len = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: len }, () => chars.charAt(Math.random() * chars.length | 0)).join("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

    if (!hasWallet) {
      setError("Please connect an Ethereum wallet (e.g., MetaMask)");
      setIsLoading(false);
      return;
    }

    let address: string;
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      address = accounts[0];
    } catch (err: any) {
      setError("Failed to connect wallet");
      setIsLoading(false);
      return;
    }

    try {
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(errorText || "Failed to register user");
      }
      console.log("User registration response:", await userRes.json());
    } catch (err: any) {
      setError(err.message || "Error registering user");
      setIsLoading(false);
      return;
    }

    const shortCode = genCode();
    try {
      const ipfsRes = await fetch("/api/ipfs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ short: shortCode, url: longUrl }),
      });
      if (!ipfsRes.ok) {
        const text = await ipfsRes.text();
        throw new Error(text || "IPFS upload failed");
      }
      const { cid } = await ipfsRes.json();
      console.log("IPFS response:", { cid });
      if (!cid || typeof cid !== "string") {
        throw new Error("Invalid CID returned from IPFS");
      }

      try {
        const codeBytes = ethers.utils.toUtf8Bytes(shortCode).slice(0, 6);
        const cidBytes = ethers.utils.toUtf8Bytes(cid);
        const tx = await registryContract.register(codeBytes, cidBytes);
        await tx.wait();
        console.log("Ethereum transaction confirmed:", tx.hash);
      } catch (err: any) {
        console.error("Ethereum registration error:", err);
        throw new Error("Failed to register link on Ethereum");
      }

      try {
        const linkRes = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shortCode, cid, ownerAddress: address }),
        });
        if (!linkRes.ok) {
          const text = await linkRes.text();
          throw new Error(text || "Failed to save link");
        }
        console.log("Link creation response:", await linkRes.json());
      } catch (err: any) {
        console.error("Link creation error:", err);
        throw new Error(err.message || "Failed to save link to database");
      }

      setShortUrl(`${baseUrl}/${shortCode}`);
    } catch (err: any) {
      console.error("Error shortening URL:", err);
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
              <ClipboardIcon className="h-6 w-6 text-purple-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}