// src/app/[shortCode]/page.tsx
"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { registryContract } from "../../utils/ethers";
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
      const { url } = await res.json();  // { short, url }

      // 3) Redirect to the actual URL
      window.location.href = url;
    })();
  }, [shortCode]);

  return <p className="p-8 text-center">Redirecting…</p>;
}
