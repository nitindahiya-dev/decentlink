// src/app/api/click/route.ts

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  const { shortCode, device, source, location } = await req.json();

  const link = await prisma.link.findUnique({ where: { shortCode } });
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  await prisma.click.create({
    data: {
      linkId: link.id,
      device,
      source,
      location,
    },
  });

  return NextResponse.json({ success: true });
}
