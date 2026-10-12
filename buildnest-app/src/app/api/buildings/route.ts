import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
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
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch buildings" }, { status: 500 });
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
