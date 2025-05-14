import { NextResponse } from "next/server";
import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

export async function POST(request: Request) {
  try {
    const { short: shortCode, url } = await request.json();

    // Validate inputs
    if (!shortCode || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shortCodeRegex = /^[a-zA-Z0-9]{6,10}$/;
    if (!shortCodeRegex.test(shortCode)) {
      return NextResponse.json({ error: "Invalid shortCode format" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Create JSON payload for Pinata
    const payload = { short: shortCode, url };

    // Upload to Pinata
    const pinataResponse = await pinata.pinJSONToIPFS(payload, {
      pinataMetadata: { name: "mapping.json" },
      pinataOptions: { cidVersion: 0 }, // Ensure CIDv0 for compatibility
    });

    console.log("[IPFS Route] Pinata JSON response:", pinataResponse);
    console.log("[IPFS Route] Pinata IpfsHash:", pinataResponse.IpfsHash);

    if (!pinataResponse.IpfsHash || !pinataResponse.IpfsHash.startsWith("Qm")) {
      throw new Error("Invalid CID returned from Pinata");
    }

    return NextResponse.json({ cid: pinataResponse.IpfsHash });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: "Failed to upload to IPFS", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Failed to upload to IPFS", details: "Unknown error" }, { status: 500 });
    }
  }
}