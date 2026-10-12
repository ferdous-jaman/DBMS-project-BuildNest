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
        { FullName: { contains: search } },
        { Specialization: { contains: search } },
        { Phone: { contains: search } },
      ];
    }
    if (status) where.WorkStatus = status;

    const [workers, total] = await Promise.all([
      prisma.workers.findMany({
        where,
        skip,
        take: limit,
        orderBy: { WorkerID: "desc" },
        include: {
          Sector_Heads: { select: { FullName: true, Sector: true, Buildings: { select: { ProjectName: true } } } },
          Worker_Payments: { select: { AmountPaid: true } },
          Worker_Attendance: {
            where: { Status: "Present" },
            select: { AttendanceID: true },
          },
        },
      }),
      prisma.workers.count({ where }),
    ]);

    const workersWithStats = workers.map((w) => ({
      ...w,
      totalPaid: w.Worker_Payments.reduce((sum, p) => sum + Number(p.AmountPaid || 0), 0),
      presentDays: w.Worker_Attendance.length,
    }));

    return NextResponse.json({ workers: workersWithStats, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const worker = await prisma.workers.create({
      data: {
        FullName: body.FullName,
        Specialization: body.Specialization,
        Phone: body.Phone,
        Address: body.Address,
        HeadID: body.HeadID ? parseInt(body.HeadID) : null,
        DailyWage: body.DailyWage ? parseFloat(body.DailyWage) : null,
        WorkStatus: body.WorkStatus || "Active",
      },
    });
    return NextResponse.json(worker, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create worker" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { WorkerID, ...data } = body;
    const worker = await prisma.workers.update({
      where: { WorkerID: parseInt(WorkerID) },
      data: {
        FullName: data.FullName,
        Specialization: data.Specialization,
        Phone: data.Phone,
        Address: data.Address,
        HeadID: data.HeadID ? parseInt(data.HeadID) : null,
        DailyWage: data.DailyWage ? parseFloat(data.DailyWage) : null,
        WorkStatus: data.WorkStatus,
      },
    });
    return NextResponse.json(worker);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update worker" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.workers.delete({ where: { WorkerID: parseInt(id) } });
    return NextResponse.json({ message: "Worker deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete worker" }, { status: 500 });
  }
}
