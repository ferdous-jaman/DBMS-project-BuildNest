import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database offline");
    }

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
    console.warn("Database offline, returning fallback safety incidents:", error);
    const demoIncidents = [
      {
        IncidentID: 1,
        IncidentDate: "2024-02-15T00:00:00.000Z",
        IncidentType: "Minor Hand Injury",
        Severity: "Low",
        ResolutionStatus: "Resolved",
        Description: "Worker sustained small abrasion while cutting rebar steel. First aid administered immediately.",
        Workers: { FullName: "Rafiqul Islam", Specialization: "Mason", Sector_Heads: { Sector: "Civil & Masonry" } },
      },
      {
        IncidentID: 2,
        IncidentDate: "2024-02-28T00:00:00.000Z",
        IncidentType: "Scaffolding Plank Slip",
        Severity: "Medium",
        ResolutionStatus: "Unresolved",
        Description: "Unsecured wooden plank slipped on 3rd floor scaffolding. Safety harness prevented fall. Reinforcement inspection needed.",
        Workers: { FullName: "Abdul Karim", Specialization: "Electrician", Sector_Heads: { Sector: "Electrical" } },
      },
    ];
    return NextResponse.json({
      incidents: demoIncidents,
      total: demoIncidents.length,
      page: 1,
      limit: 10,
      stats: [{ ResolutionStatus: "Resolved", _count: { IncidentID: 1 } }, { ResolutionStatus: "Unresolved", _count: { IncidentID: 1 } }],
    });
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
