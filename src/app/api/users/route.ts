// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const { address } = await request.json();
  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }
  const user = await prisma.user.upsert({
    where: { address },
    create: { address },
    update: {},
  });
  return NextResponse.json(user);
}
