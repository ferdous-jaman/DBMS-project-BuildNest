import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { ContractorName: { contains: search } },
        { Buildings: { ProjectName: { contains: search } } },
      ];
    }
    if (status) where.Status = status;

    const [contracts, total] = await Promise.all([
      prisma.contracts.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ContractID: "desc" },
        include: { Buildings: { select: { ProjectName: true, Location: true } } },
      }),
      prisma.contracts.count({ where }),
    ]);

    return NextResponse.json({ contracts, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contract = await prisma.contracts.create({
      data: {
        BuildingID: body.BuildingID ? parseInt(body.BuildingID) : null,
        ContractorName: body.ContractorName,
        StartDate: body.StartDate ? new Date(body.StartDate) : null,
        EndDate: body.EndDate ? new Date(body.EndDate) : null,
        TotalAmount: body.TotalAmount ? parseFloat(body.TotalAmount) : null,
        Status: body.Status || "Pending",
        Terms: body.Terms,
      },
    });
    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ContractID, ...data } = body;
    const contract = await prisma.contracts.update({
      where: { ContractID: parseInt(ContractID) },
      data: {
        BuildingID: data.BuildingID ? parseInt(data.BuildingID) : null,
        ContractorName: data.ContractorName,
        StartDate: data.StartDate ? new Date(data.StartDate) : null,
        EndDate: data.EndDate ? new Date(data.EndDate) : null,
        TotalAmount: data.TotalAmount ? parseFloat(data.TotalAmount) : null,
        Status: data.Status,
        Terms: data.Terms,
      },
    });
    return NextResponse.json(contract);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update contract" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.contracts.delete({ where: { ContractID: parseInt(id) } });
    return NextResponse.json({ message: "Contract deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
  }
}
