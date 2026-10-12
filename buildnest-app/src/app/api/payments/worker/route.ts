import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    const [workerPayments, ownerPayments, totalWorkerPay, totalOwnerPay] = await Promise.all([
      prisma.worker_Payments.findMany({
        skip,
        take: limit,
        orderBy: { PaymentDate: "desc" },
        include: {
          Workers: {
            select: {
              FullName: true,
              Specialization: true,
              Sector_Heads: { select: { Sector: true } },
            },
          },
        },
      }),
      prisma.owner_Payments.findMany({
        take: 10,
        orderBy: { PaymentDate: "desc" },
        include: { Owners: { select: { FullName: true, Phone: true } } },
      }),
      prisma.worker_Payments.aggregate({ _sum: { AmountPaid: true }, _count: true }),
      prisma.owner_Payments.aggregate({ _sum: { Amount: true }, _count: true }),
    ]);

    return NextResponse.json({
      workerPayments,
      ownerPayments,
      stats: {
        totalWorkerPay: Number(totalWorkerPay._sum.AmountPaid || 0),
        totalOwnerPay: Number(totalOwnerPay._sum.Amount || 0),
        workerPaymentCount: totalWorkerPay._count,
        ownerPaymentCount: totalOwnerPay._count,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
