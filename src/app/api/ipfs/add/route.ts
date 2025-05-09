// src/app/api/ipfs/add/route.ts
import { NextResponse } from "next/server";

// Load Pinata JWT from env
const PINATA_KEY = process.env.PINATA_JWT!;
if (!PINATA_KEY) {
  throw new Error("Missing PINATA_KEY in environment");
}

export async function POST(req: Request) {
  console.log("[IPFS Route] Starting POST handler");

  try {
    const { short, url } = await req.json();
    console.log("[IPFS Route] Request body:", { short, url });

    const mapBlob = new Blob([
      JSON.stringify({ short, url })
    ], { type: "application/json" });
    const formData = new FormData();
    formData.append("file", mapBlob, "mapping.json");
    console.log("[IPFS Route] FormData keys:", Array.from(formData.keys()));

    // Send to Pinata
    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_KEY}`,
        },
        body: formData,
      }
    );
    console.log("[IPFS Route] HTTP status:", res.status, res.statusText);

    const json = await res.json();
    console.log("[IPFS Route] Pinata JSON response:", json);

    if (!res.ok) {
      const errMsg = json.error || JSON.stringify(json);
      console.error("[IPFS Route] Pinata error:", errMsg);
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    const cid = json.IpfsHash;
    console.log("[IPFS Route] Pinata IpfsHash:", cid);
    if (!cid) {
      console.error("[IPFS Route] No IpfsHash in response");
      throw new Error("No IpfsHash returned");
    }

    return NextResponse.json({ cid });
  } catch (err: any) {
    console.error("[IPFS Route] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
