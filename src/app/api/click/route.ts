import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { shortCode, device, source, location } = await request.json();

    // Validate inputs
    if (!shortCode || !device || !source || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shortCodeRegex = /^[a-zA-Z0-9]{6,10}$/;
    if (!shortCodeRegex.test(shortCode)) {
      return NextResponse.json({ error: "Invalid shortCode format" }, { status: 400 });
    }

    const validDevices = ["MOBILE", "DESKTOP", "TABLET"];
    if (!validDevices.includes(device)) {
      return NextResponse.json({ error: `Invalid device type. Expected one of: ${validDevices.join(", ")}` }, { status: 400 });
    }

    if (typeof source !== "string" || source.length > 255) {
      return NextResponse.json({ error: "Invalid source format" }, { status: 400 });
    }

    if (typeof location !== "string" || location.length > 100) {
      return NextResponse.json({ error: "Invalid location format" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({ where: { shortCode } });
    if (!link) {
      console.error(`Link not found for shortCode: ${shortCode}`);
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const click = await prisma.click.create({
      data: {
        linkId: link.id,
        device,
        source,
        location,
      },
    });

    return NextResponse.json({ success: true, click });
  } catch (error: any) {
    console.error("Click API Error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}