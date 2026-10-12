import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.ResolutionStatus = status;

    const [incidents, total, stats] = await Promise.all([
      prisma.safety_Incidents.findMany({
        where,
        skip,
        take: limit,
        orderBy: { IncidentDate: "desc" },
        include: {
          Workers: {
            select: {
              FullName: true,
              Specialization: true,
              Sector_Heads: { select: { Sector: true } },
            },
          },
        },
      }),
      prisma.safety_Incidents.count({ where }),
      prisma.safety_Incidents.groupBy({
        by: ["ResolutionStatus"],
        _count: { IncidentID: true },
      }),
    ]);

    return NextResponse.json({ incidents, total, page, limit, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch safety incidents" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const incident = await prisma.safety_Incidents.update({
      where: { IncidentID: parseInt(body.IncidentID) },
      data: { ResolutionStatus: body.ResolutionStatus },
    });
    return NextResponse.json(incident);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
