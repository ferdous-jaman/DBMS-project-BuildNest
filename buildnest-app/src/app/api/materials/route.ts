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
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
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
