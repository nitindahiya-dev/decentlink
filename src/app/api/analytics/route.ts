import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { subDays, format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        links: {
          include: {
            clicks: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalClicks = user.links.reduce((sum, link) => sum + link.clicks.length, 0);

    const sevenDaysAgo = subDays(new Date(), 7);
    const timeline = await prisma.click.groupBy({
      by: ["createdAt"],
      where: {
        link: { ownerId: user.id },
        createdAt: { gte: sevenDaysAgo },
      },
      _count: { _all: true },
    });
    const timelineData = Array.from({ length: 7 }, (_, i) => {
      const day = format(subDays(new Date(), i), "yyyy-MM-dd");
      const count = timeline.find((t) => format(t.createdAt, "yyyy-MM-dd") === day)?._count._all || 0;
      return { day, count };
    }).reverse();

    const traffic = await prisma.click.groupBy({
      by: ["source"],
      where: { link: { ownerId: user.id } },
      _count: { _all: true },
    });
    const trafficData = traffic.map((t) => ({
      name: t.source,
      value: t._count._all,
    }));

    const devices = await prisma.click.groupBy({
      by: ["device"],
      where: { link: { ownerId: user.id } },
      _count: { _all: true },
    });
    const devicesData = devices.map((d) => ({
      device: d.device,
      clicks: d._count._all,
    }));

    const locations = await prisma.click.groupBy({
      by: ["location"],
      where: { link: { ownerId: user.id } },
      _count: { _all: true },
    });
    const locationsData = locations.map((l) => ({
      name: l.location,
      clicks: l._count._all,
    }));

    const topLinks = user.links.map((link) => ({
      code: link.shortCode,
      url: link.cid, // Adjust if URL is stored elsewhere
      clicks: link.clicks.length,
    })).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    const performance = [
      { metric: "Avg. Click Time", value: "N/A" },
      { metric: "Conversion Rate", value: "N/A" },
    ];

    const recentActivity = await prisma.click.findMany({
      where: { link: { ownerId: user.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        createdAt: true,
        location: true,
        device: true,
      },
    });

    return NextResponse.json({
      totalClicks,
      timeline: timelineData,
      traffic: trafficData.length ? trafficData : [{ name: "No Data", value: 0 }],
      devices: devicesData.length ? devicesData : [{ device: "No Data", clicks: 0 }],
      locations: locationsData.length ? locationsData : [{ name: "No Data", clicks: 0 }],
      topLinks: topLinks.length ? topLinks : [{ code: "No Links", url: "", clicks: 0 }],
      performance,
      recentActivity: recentActivity.length ? recentActivity : [],
      hasLinks: user.links.length > 0,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Analytics API Error:", error.message);
    } else {
      console.error("Analytics API Error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}