import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    if (!(await isDatabaseAvailable())) {
      throw new Error("Database offline");
    }

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
    console.warn("Database offline, returning fallback payments:", error);
    const demoWorkerPayments = [
      {
        PaymentID: 101,
        AmountPaid: 25500,
        PaymentDate: "2024-03-01T00:00:00.000Z",
        PaymentMethod: "bKash",
        Workers: { FullName: "Rafiqul Islam", Specialization: "Mason", Sector_Heads: { Sector: "Civil & Masonry" } },
      },
      {
        PaymentID: 102,
        AmountPaid: 28500,
        PaymentDate: "2024-03-01T00:00:00.000Z",
        PaymentMethod: "Bank Transfer",
        Workers: { FullName: "Abdul Karim", Specialization: "Electrician", Sector_Heads: { Sector: "Electrical" } },
      },
      {
        PaymentID: 103,
        AmountPaid: 27000,
        PaymentDate: "2024-03-02T00:00:00.000Z",
        PaymentMethod: "Cash",
        Workers: { FullName: "Mohammad Ali", Specialization: "Plumber", Sector_Heads: { Sector: "Plumbing" } },
      },
      {
        PaymentID: 104,
        AmountPaid: 24000,
        PaymentDate: "2024-03-02T00:00:00.000Z",
        PaymentMethod: "Nagad",
        Workers: { FullName: "Sohag Hossain", Specialization: "Steel Fixer", Sector_Heads: { Sector: "Civil & Masonry" } },
      },
    ];
    const demoOwnerPayments = [
      {
        PaymentID: 201,
        Amount: 1500000,
        PaymentDate: "2024-02-15T00:00:00.000Z",
        PaymentMethod: "Bank Transfer",
        Owners: { FullName: "Engr. Mahmudur Rahman", Phone: "01711001122" },
      },
      {
        PaymentID: 202,
        Amount: 2000000,
        PaymentDate: "2024-02-20T00:00:00.000Z",
        PaymentMethod: "Cheque",
        Owners: { FullName: "Dr. Farzana Akhter", Phone: "01819223344" },
      },
    ];
    return NextResponse.json({
      workerPayments: demoWorkerPayments,
      ownerPayments: demoOwnerPayments,
      stats: {
        totalWorkerPay: 105000,
        totalOwnerPay: 3500000,
        workerPaymentCount: 4,
        ownerPaymentCount: 2,
      },
    });
  }
}
