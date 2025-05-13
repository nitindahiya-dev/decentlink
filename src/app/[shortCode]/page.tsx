import { notFound, redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { headers } from "next/headers";
import UAParser from "ua-parser-js";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export const viewport = {
  themeColor: "#4facfe",
};

export default async function ShortLinkPage({ params }: { params: Promise<{ shortCode: string }> }) {
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

  // Validate cid (IPFS CID format, supports CIDv0 and CIDv1)
  const cidRegex = /^(Qm[1-9A-Za-z]{44}|[bcdf][a-zA-Z0-9+\/]{58,})$/;
  if (!cidRegex.test(link.cid)) {
    console.error(`Invalid CID: ${link.cid}`);
    notFound();
  }

  // Detect device using ua-parser-js
  let device: "MOBILE" | "DESKTOP" | "TABLET" = "DESKTOP"; // Default
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    console.log("User-Agent:", userAgent); // Debug
    const parser = UAParser(userAgent); // Call as function
    const deviceType = parser.getDevice().type;
    if (deviceType === "mobile") {
      device = "MOBILE";
    } else if (deviceType === "tablet") {
      device = "TABLET";
    }
  } catch (error) {
    console.error("Device detection error:", error);
    // Fallback to DESKTOP
  }

  // Record click
  try {
    const headersList = await headers(); // Re-await for safety
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shortCode,
        device,
        source: headersList.get("referer") || "DIRECT",
        location: "UNKNOWN", // Replace with IP geolocation in production
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Click API error:", errorText);
    }
  } catch (error) {
    console.error("Failed to record click:", error);
    // Continue with redirection
  }

  // Fetch original URL from IPFS
  let originalUrl = "";
  try {
    const ipfsBaseUrl = process.env.NODE_ENV === "production" ? "https://ipfs.io" : "http://ipfs.io";
    const ipfsRes = await fetch(`${ipfsBaseUrl}/ipfs/${link.cid}`);
    if (!ipfsRes.ok) {
      throw new Error("Failed to fetch from IPFS");
    }
    const { url } = await ipfsRes.json();
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL in IPFS response");
    }
    originalUrl = url;
  } catch (error) {
    console.error("IPFS fetch error:", error);
    originalUrl = "/";
  }

  // Redirect to original URL
  redirect(originalUrl);
}