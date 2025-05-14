// src/app/api/click/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { DeviceType, SourceType } from "@prisma/client";

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

    // Validate device against Prisma enum
    if (!Object.values(DeviceType).includes(device as DeviceType)) {
      return NextResponse.json({
        error: `Invalid device type. Expected one of: ${Object.values(DeviceType).join(", ")}`,
      }, { status: 400 });
    }

    // Validate source against Prisma enum
    if (!Object.values(SourceType).includes(source as SourceType)) {
      return NextResponse.json({
        error: `Invalid source type. Expected one of: ${Object.values(SourceType).join(", ")}`,
      }, { status: 400 });
    }

    if (typeof location !== "string" || location.length > 100) {
      return NextResponse.json({ error: "Invalid location format" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({ where: { shortCode } });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const click = await prisma.click.create({
      data: {
        linkId: link.id,
        device: device as DeviceType,
        source: source as SourceType,
        location,
      },
    });

    return NextResponse.json({ success: true, click });
  } catch (error: unknown) {
    console.error("Click API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 });
  }
}
