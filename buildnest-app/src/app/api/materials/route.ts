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
            { MaterialName: { contains: search } },
            { Category: { contains: search } },
          ],
        }
      : {};

    const [materials, total] = await Promise.all([
      prisma.materials.findMany({
        where,
        skip,
        take: limit,
        orderBy: { MaterialID: "desc" },
        include: {
          Buildings: { select: { ProjectName: true } },
          Material_Usage_Log: { select: { QuantityUsed: true } },
          Material_Orders: { select: { QuantityOrdered: true, TotalCost: true } },
        },
      }),
      prisma.materials.count({ where }),
    ]);

    const materialsWithStats = materials.map((m) => ({
      ...m,
      totalUsed: m.Material_Usage_Log.reduce((s, l) => s + (l.QuantityUsed || 0), 0),
      totalOrdered: m.Material_Orders.reduce((s, o) => s + (o.QuantityOrdered || 0), 0),
      totalOrderCost: m.Material_Orders.reduce((s, o) => s + Number(o.TotalCost || 0), 0),
    }));

    return NextResponse.json({ materials: materialsWithStats, total, page, limit });
  } catch (error) {
    console.warn("Database offline, returning fallback materials:", error);
    const demoMaterials = [
      {
        MaterialID: 1,
        MaterialName: "Portland Composite Cement (50kg)",
        Category: "Cement & Concrete",
        UnitPrice: 580,
        StockQuantity: 120,
        Buildings: { ProjectName: "Skyline Heights Tower A" },
        totalUsed: 850,
        totalOrdered: 1000,
        totalOrderCost: 580000,
      },
      {
        MaterialID: 2,
        MaterialName: "500W Deformed Steel Rebar (16mm)",
        Category: "Steel & Rebar",
        UnitPrice: 95000,
        StockQuantity: 15,
        Buildings: { ProjectName: "Skyline Heights Tower A" },
        totalUsed: 40,
        totalOrdered: 55,
        totalOrderCost: 5225000,
      },
      {
        MaterialID: 3,
        MaterialName: "First Class Red Bricks (per 1k)",
        Category: "Bricks & Blocks",
        UnitPrice: 12000,
        StockQuantity: 45,
        Buildings: { ProjectName: "Green Valley Residency" },
        totalUsed: 120,
        totalOrdered: 165,
        totalOrderCost: 1980000,
      },
      {
        MaterialID: 4,
        MaterialName: "PVC Conduit Pipe (25mm)",
        Category: "Electrical",
        UnitPrice: 180,
        StockQuantity: 300,
        Buildings: { ProjectName: "Lakeview Luxury Suites" },
        totalUsed: 500,
        totalOrdered: 800,
        totalOrderCost: 144000,
      },
    ];
    return NextResponse.json({ materials: demoMaterials, total: demoMaterials.length, page: 1, limit: 10 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const material = await prisma.materials.create({
      data: {
        MaterialName: body.MaterialName,
        Category: body.Category,
        UnitPrice: body.UnitPrice ? parseFloat(body.UnitPrice) : null,
        StockQuantity: body.StockQuantity ? parseInt(body.StockQuantity) : null,
        BuildingID: body.BuildingID ? parseInt(body.BuildingID) : null,
      },
    });
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { MaterialID, ...data } = body;
    const material = await prisma.materials.update({
      where: { MaterialID: parseInt(MaterialID) },
      data: {
        MaterialName: data.MaterialName,
        Category: data.Category,
        UnitPrice: data.UnitPrice ? parseFloat(data.UnitPrice) : null,
        StockQuantity: data.StockQuantity ? parseInt(data.StockQuantity) : null,
        BuildingID: data.BuildingID ? parseInt(data.BuildingID) : null,
      },
    });
    return NextResponse.json(material);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.materials.delete({ where: { MaterialID: parseInt(id) } });
    return NextResponse.json({ message: "Material deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
