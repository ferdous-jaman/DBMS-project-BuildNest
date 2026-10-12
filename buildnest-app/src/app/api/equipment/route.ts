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
    if (status) where.AvailabilityStatus = status;

    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { EquipmentID: "desc" },
        include: {
          Equipment_Usage_Log: {
            include: {
              Workers: { select: { FullName: true } },
            },
            orderBy: { StartDate: "desc" },
            take: 3,
          },
        },
      }),
      prisma.equipment.count({ where }),
    ]);

    return NextResponse.json({ equipment, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { EquipmentID, ...data } = body;
    const equipment = await prisma.equipment.update({
      where: { EquipmentID: parseInt(EquipmentID) },
      data: { AvailabilityStatus: data.AvailabilityStatus },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update equipment" }, { status: 500 });
  }
}
