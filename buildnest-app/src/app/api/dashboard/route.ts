import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalBuildings,
      totalOwners,
      totalWorkers,
      totalMaterials,
      activeWorkers,
      pendingContracts,
      unresolvedIncidents,
      unpaidInvoices,
      totalWorkerPayments,
      totalOwnerPayments,
      buildingsByLocation,
      workersBySpecialization,
      recentPayments,
      topBuildings,
      materialsByCategory,
      apartmentStats,
    ] = await Promise.all([
      prisma.buildings.count(),
      prisma.owners.count(),
      prisma.workers.count(),
      prisma.materials.count(),
      prisma.workers.count({ where: { WorkStatus: "Active" } }),
      prisma.contracts.count({ where: { Status: "Pending" } }),
      prisma.safety_Incidents.count({ where: { ResolutionStatus: "Unresolved" } }),
      prisma.invoices.count({ where: { Status: "Unpaid" } }),
      prisma.worker_Payments.aggregate({ _sum: { AmountPaid: true } }),
      prisma.owner_Payments.aggregate({ _sum: { Amount: true } }),
      prisma.buildings.groupBy({
        by: ["Location"],
        _count: { BuildingID: true },
        orderBy: { _count: { BuildingID: "desc" } },
        take: 6,
      }),
      prisma.workers.groupBy({
        by: ["Specialization"],
        _count: { WorkerID: true },
        orderBy: { _count: { WorkerID: "desc" } },
      }),
      prisma.worker_Payments.findMany({
        take: 5,
        orderBy: { PaymentDate: "desc" },
        include: { Workers: { select: { FullName: true } } },
      }),
      prisma.buildings.findMany({
        take: 5,
        orderBy: { TotalCost: "desc" },
        include: {
          Apartments: { select: { Status: true } },
          Project_Stages: { select: { Progress: true } },
        },
      }),
      prisma.materials.groupBy({
        by: ["Category"],
        _count: { MaterialID: true },
        _sum: { StockQuantity: true },
      }),
      prisma.apartments.groupBy({
        by: ["Status"],
        _count: { ApartmentID: true },
      }),
    ]);

    const totalExpenditure =
      Number(totalWorkerPayments._sum.AmountPaid || 0) +
      Number(totalOwnerPayments._sum.Amount || 0);

    return NextResponse.json({
      stats: {
        totalBuildings,
        totalOwners,
        totalWorkers,
        activeWorkers,
        totalMaterials,
        pendingContracts,
        unresolvedIncidents,
        unpaidInvoices,
        totalExpenditure,
        totalWorkerPayments: Number(totalWorkerPayments._sum.AmountPaid || 0),
        totalOwnerPayments: Number(totalOwnerPayments._sum.Amount || 0),
      },
      charts: {
        buildingsByLocation: buildingsByLocation.map((b) => ({
          location: b.Location || "Unknown",
          count: b._count.BuildingID,
        })),
        workersBySpecialization: workersBySpecialization.map((w) => ({
          specialization: w.Specialization || "Unknown",
          count: w._count.WorkerID,
        })),
        materialsByCategory: materialsByCategory.map((m) => ({
          category: m.Category || "Unknown",
          count: m._count.MaterialID,
          stock: m._sum.StockQuantity || 0,
        })),
        apartmentStats: apartmentStats.map((a) => ({
          status: a.Status || "Unknown",
          count: a._count.ApartmentID,
        })),
      },
      recentPayments,
      topBuildings: topBuildings.map((b) => ({
        ...b,
        avgProgress:
          b.Project_Stages.length > 0
            ? b.Project_Stages.reduce(
                (sum, s) => sum + Number(s.Progress || 0),
                0
              ) / b.Project_Stages.length
            : 0,
        soldApartments: b.Apartments.filter((a) => a.Status === "Sold").length,
        totalApartments: b.Apartments.length,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
