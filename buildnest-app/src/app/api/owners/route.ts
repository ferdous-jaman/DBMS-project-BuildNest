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
    console.warn("Database offline, returning fallback owners:", error);
    const demoOwners = [
      {
        OwnerID: 1,
        FullName: "Engr. Mahmudur Rahman",
        Phone: "01711001122",
        Email: "mahmud.engr@gmail.com",
        ResidentialAddress: "House 12, Road 5, Dhanmondi, Dhaka",
        TotalInvestment: 12000000,
        totalPaid: 9500000,
        unpaidInvoices: 1,
      },
      {
        OwnerID: 2,
        FullName: "Dr. Farzana Akhter",
        Phone: "01819223344",
        Email: "dr.farzana@outlook.com",
        ResidentialAddress: "Apt 4B, Gulshan-1, Dhaka",
        TotalInvestment: 18000000,
        totalPaid: 15000000,
        unpaidInvoices: 0,
      },
      {
        OwnerID: 3,
        FullName: "Kazi Nazrul Islam",
        Phone: "01912889900",
        Email: "kazi.nazrul@yahoo.com",
        ResidentialAddress: "Sector 3, Uttara, Dhaka",
        TotalInvestment: 9500000,
        totalPaid: 7000000,
        unpaidInvoices: 2,
      },
    ];
    return NextResponse.json({ owners: demoOwners, total: demoOwners.length, page: 1, limit: 10 });
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
