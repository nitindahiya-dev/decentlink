//src/app/[shortCode]/page.tsx

"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { registryContract } from "../../utils/ethers"; // Adjust path if needed
import { ethers } from "ethers";

export default function Resolver() {
  const { shortCode } = useParams();

  useEffect(() => {
    if (!shortCode) return;
    (async () => {
      // 1) Resolve the CID on-chain
      const codeBytes = ethers.utils.toUtf8Bytes(shortCode).slice(0, 6);
      const cidBytes: Uint8Array = await registryContract.resolve(codeBytes);
      const cid = ethers.utils.toUtf8String(cidBytes);

      // 2) Fetch the JSON from IPFS
      const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
      if (!res.ok) {
        console.error("Failed to fetch IPFS JSON", await res.text());
        return;
      }
      const { url } = await res.json();

      // 3) Redirect to the actual URL
      setTimeout(() => {
        window.location.href = url;
      }, 3000); // Wait 3s for animation
    })();
  }, [shortCode]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      <svg
        className="w-32 h-32 animate-pulse"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M30 50 H60 L50 40 M60 50 L50 60"
          stroke="url(#gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
        </defs>
      </svg>
      <p className="mt-4 text-lg text-white animate-pulse">Teleporting you to the link…</p>
    </div>
  );
}
