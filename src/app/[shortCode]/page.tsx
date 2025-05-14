// src/app/[shortCode]/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
};

export const viewport = {
  themeColor: "#4facfe",
};

export default async function ShortLinkPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;

  // Validate shortCode (alphanumeric, 6-10 characters)
  const shortCodeRegex = /^[a-zA-Z0-9]{6,10}$/;
  if (!shortCodeRegex.test(shortCode)) {
    console.error(`Invalid shortCode: ${shortCode}`);
    notFound();
  }

  // Fetch link by shortCode
  const link = await prisma.link.findUnique({
    where: { shortCode },
    select: { id: true, cid: true },
  });
  if (!link) {
    notFound();
  }

  // Validate CID (IPFS CID format)
  const cidRegex = /^(Qm[1-9A-Za-z]{44}|[bB][a-zA-Z0-9+\/]{58,})$/;
  if (!cidRegex.test(link.cid)) {
    console.error(`Invalid CID: ${link.cid}`);
    notFound();
  }

  // Detect device using ua-parser-js
  let device: "MOBILE" | "DESKTOP" | "TABLET" = "DESKTOP";
  try {
    const hdrs = await headers();
    const ua = hdrs.get("user-agent") || "";
    console.log("User-Agent:", ua);
    const parser = new UAParser(ua);
    const type = parser.getDevice().type;
    if (type === "mobile") device = "MOBILE";
    else if (type === "tablet") device = "TABLET";
  } catch (e) {
    console.error("Device detection error:", e);
  }

  // Record click
  try {
    const hdrs = await headers();
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shortCode,
        device,
        source: hdrs.get("referer") || "DIRECT",
        location: "UNKNOWN",
      }),
    });
  } catch (e) {
    console.error("Failed to record click:", e);
  }

  // Fetch original URL from IPFS
  let originalUrl = "/";
  try {
    const ipfsBase =
      process.env.NODE_ENV === "production"
        ? "https://ipfs.io"
        : "http://ipfs.io";
    const res = await fetch(`${ipfsBase}/ipfs/${link.cid}`);
    const { url } = await res.json();
    if (typeof url === "string" && url) originalUrl = url;
    else throw new Error("Invalid IPFS response");
  } catch (e) {
    console.error("IPFS fetch error:", e);
  }

  // Redirect
  redirect(originalUrl);
}
