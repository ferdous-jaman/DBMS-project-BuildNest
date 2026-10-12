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
            { FullName: { contains: search } },
            { Email: { contains: search } },
            { Phone: { contains: search } },
          ],
        }
      : {};

    const [owners, total] = await Promise.all([
      prisma.owners.findMany({
        where,
        skip,
        take: limit,
        orderBy: { OwnerID: "desc" },
        include: {
          Owner_Payments: { select: { Amount: true, PaymentMethod: true } },
          Invoices: { select: { Status: true, Amount: true } },
        },
      }),
      prisma.owners.count({ where }),
    ]);

    const ownersWithStats = owners.map((o) => ({
      ...o,
      totalPaid: o.Owner_Payments.reduce((sum, p) => sum + Number(p.Amount || 0), 0),
      unpaidInvoices: o.Invoices.filter((i) => i.Status === "Unpaid").length,
    }));

    return NextResponse.json({ owners: ownersWithStats, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch owners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const owner = await prisma.owners.create({
      data: {
        FullName: body.FullName,
        Phone: body.Phone,
        Email: body.Email,
        ResidentialAddress: body.ResidentialAddress,
        TotalInvestment: body.TotalInvestment ? parseFloat(body.TotalInvestment) : null,
      },
    });
    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create owner" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { OwnerID, ...data } = body;
    const owner = await prisma.owners.update({
      where: { OwnerID: parseInt(OwnerID) },
      data: {
        FullName: data.FullName,
        Phone: data.Phone,
        Email: data.Email,
        ResidentialAddress: data.ResidentialAddress,
        TotalInvestment: data.TotalInvestment ? parseFloat(data.TotalInvestment) : null,
      },
    });
    return NextResponse.json(owner);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update owner" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.owners.delete({ where: { OwnerID: parseInt(id) } });
    return NextResponse.json({ message: "Owner deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete owner" }, { status: 500 });
  }
}
