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
    console.warn("Database offline, returning fallback equipment:", error);
    const demoEquipment = [
      {
        EquipmentID: 1,
        EquipmentName: "Tower Crane (60m Jib)",
        Status: "In Use",
        EquipmentCondition: "Good",
        Equipment_Usage_Log: [
          { LogID: 1, StartDate: "2024-02-01T08:00:00.000Z", EndDate: null, Workers: { FullName: "Rafiqul Islam" } },
        ],
      },
      {
        EquipmentID: 2,
        EquipmentName: "Concrete Mixer Truck (8m³)",
        Status: "Available",
        EquipmentCondition: "Excellent",
        Equipment_Usage_Log: [
          { LogID: 2, StartDate: "2024-02-10T09:00:00.000Z", EndDate: "2024-02-10T17:00:00.000Z", Workers: { FullName: "Abdul Karim" } },
        ],
      },
      {
        EquipmentID: 3,
        EquipmentName: "Hydraulic Excavator CAT 320",
        Status: "Maintenance",
        EquipmentCondition: "Fair",
        Equipment_Usage_Log: [
          { LogID: 3, StartDate: "2024-01-15T08:00:00.000Z", EndDate: "2024-01-28T18:00:00.000Z", Workers: { FullName: "Mohammad Ali" } },
        ],
      },
    ];
    return NextResponse.json({ equipment: demoEquipment, total: demoEquipment.length, page: 1, limit: 10 });
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
