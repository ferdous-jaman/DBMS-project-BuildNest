import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database offline");
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { ProjectName: { contains: search } },
            { Location: { contains: search } },
          ],
        }
      : {};

    const [buildings, total] = await Promise.all([
      prisma.buildings.findMany({
        where,
        skip,
        take: limit,
        orderBy: { BuildingID: "desc" },
        include: {
          Apartments: { select: { Status: true } },
          Project_Stages: { select: { StageName: true, Progress: true } },
          Contracts: { select: { Status: true, ContractorName: true } },
        },
      }),
      prisma.buildings.count({ where }),
    ]);

    return NextResponse.json({ buildings, total, page, limit });
  } catch (error) {
    console.warn("Database offline, returning fallback buildings:", error);
    const demoBuildings = [
      {
        BuildingID: 1,
        ProjectName: "Skyline Heights Tower A",
        Location: "Gulshan-2, Dhaka",
        NumberOfFloors: 24,
        NumberOfApartments: 48,
        TotalCost: 75000000,
        StartDate: "2023-01-15T00:00:00.000Z",
        ExpectedCompletionDate: "2025-12-31T00:00:00.000Z",
        Apartments: [{ Status: "Sold" }, { Status: "Sold" }, { Status: "Available" }],
        Project_Stages: [{ StageName: "Structural Framing", Progress: 85 }],
        Contracts: [{ Status: "Active", ContractorName: "Apex Engineering Ltd" }],
      },
      {
        BuildingID: 2,
        ProjectName: "Green Valley Residency",
        Location: "Dhanmondi Road 27, Dhaka",
        NumberOfFloors: 14,
        NumberOfApartments: 28,
        TotalCost: 42000000,
        StartDate: "2023-06-01T00:00:00.000Z",
        ExpectedCompletionDate: "2025-08-30T00:00:00.000Z",
        Apartments: [{ Status: "Sold" }, { Status: "Available" }],
        Project_Stages: [{ StageName: "Interior Finishing", Progress: 60 }],
        Contracts: [{ Status: "Active", ContractorName: "Bengal Builders Corp" }],
      },
      {
        BuildingID: 3,
        ProjectName: "Lakeview Luxury Suites",
        Location: "Sector 7, Uttara, Dhaka",
        NumberOfFloors: 18,
        NumberOfApartments: 36,
        TotalCost: 55000000,
        StartDate: "2023-09-10T00:00:00.000Z",
        ExpectedCompletionDate: "2026-03-31T00:00:00.000Z",
        Apartments: [{ Status: "Available" }, { Status: "Reserved" }],
        Project_Stages: [{ StageName: "Foundation & Piling", Progress: 40 }],
        Contracts: [{ Status: "Active", ContractorName: "Desh Construction" }],
      },
    ];
    return NextResponse.json({ buildings: demoBuildings, total: demoBuildings.length, page: 1, limit: 10 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const building = await prisma.buildings.create({
      data: {
        ProjectName: body.ProjectName,
        Location: body.Location,
        NumberOfFloors: body.NumberOfFloors ? parseInt(body.NumberOfFloors) : null,
        NumberOfApartments: body.NumberOfApartments ? parseInt(body.NumberOfApartments) : null,
        TotalCost: body.TotalCost ? parseFloat(body.TotalCost) : null,
        StartDate: body.StartDate ? new Date(body.StartDate) : null,
        ExpectedCompletionDate: body.ExpectedCompletionDate ? new Date(body.ExpectedCompletionDate) : null,
      },
    });
    return NextResponse.json(building, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create building" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { BuildingID, ...data } = body;
    const building = await prisma.buildings.update({
      where: { BuildingID: parseInt(BuildingID) },
      data: {
        ProjectName: data.ProjectName,
        Location: data.Location,
        NumberOfFloors: data.NumberOfFloors ? parseInt(data.NumberOfFloors) : null,
        NumberOfApartments: data.NumberOfApartments ? parseInt(data.NumberOfApartments) : null,
        TotalCost: data.TotalCost ? parseFloat(data.TotalCost) : null,
        StartDate: data.StartDate ? new Date(data.StartDate) : null,
        ExpectedCompletionDate: data.ExpectedCompletionDate ? new Date(data.ExpectedCompletionDate) : null,
      },
    });
    return NextResponse.json(building);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update building" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.buildings.delete({ where: { BuildingID: parseInt(id) } });
    return NextResponse.json({ message: "Building deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete building" }, { status: 500 });
  }
}
