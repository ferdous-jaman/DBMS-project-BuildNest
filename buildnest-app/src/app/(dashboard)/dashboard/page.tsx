"use client";

import { useEffect, useState } from "react";
import {
  MdApartment,
  MdBusiness,
  MdPeople,
  MdWarning,
  MdPayments,
  MdGavel,
  MdInventory,
  MdTrendingUp,
} from "react-icons/md";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface DashboardData {
  stats: {
    totalBuildings: number;
    totalOwners: number;
    totalWorkers: number;
    activeWorkers: number;
    totalMaterials: number;
    pendingContracts: number;
    unresolvedIncidents: number;
    unpaidInvoices: number;
    totalExpenditure: number;
    totalWorkerPayments: number;
    totalOwnerPayments: number;
  };
  charts: {
    buildingsByLocation: { location: string; count: number }[];
    workersBySpecialization: { specialization: string; count: number }[];
    materialsByCategory: { category: string; count: number; stock: number }[];
    apartmentStats: { status: string; count: number }[];
  };
  recentPayments: {
    PaymentID: number;
    AmountPaid: number;
    PaymentDate: string;
    PaymentMethod: string;
    Workers: { FullName: string } | null;
  }[];
  topBuildings: {
    BuildingID: number;
    ProjectName: string;
    Location: string;
    TotalCost: number;
    avgProgress: number;
    soldApartments: number;
    totalApartments: number;
  }[];
}

const CHART_COLORS = [
  "#f5a623",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-dark-400">Failed to load data</div>;

  const { stats, charts, recentPayments, topBuildings } = data;

  const statCards = [
    {
      label: "Total Buildings",
      value: stats.totalBuildings,
      icon: MdApartment,
      color: "bg-blue-500/20 text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    {
      label: "Total Owners",
      value: stats.totalOwners,
      icon: MdBusiness,
      color: "text-purple-400",
      iconBg: "bg-purple-500/20",
    },
    {
      label: "Active Workers",
      value: `${stats.activeWorkers}/${stats.totalWorkers}`,
      icon: MdPeople,
      color: "text-green-400",
      iconBg: "bg-green-500/20",
    },
    {
      label: "Total Expenditure",
      value: formatCurrency(stats.totalExpenditure),
      icon: MdPayments,
      color: "text-brand-400",
      iconBg: "bg-brand-500/20",
      isLarge: true,
    },
    {
      label: "Materials in Stock",
      value: stats.totalMaterials,
      icon: MdInventory,
      color: "text-cyan-400",
      iconBg: "bg-cyan-500/20",
    },
    {
      label: "Pending Contracts",
      value: stats.pendingContracts,
      icon: MdGavel,
      color: "text-yellow-400",
      iconBg: "bg-yellow-500/20",
    },
    {
      label: "Unresolved Incidents",
      value: stats.unresolvedIncidents,
      icon: MdWarning,
      color: "text-red-400",
      iconBg: "bg-red-500/20",
    },
    {
      label: "Unpaid Invoices",
      value: stats.unpaidInvoices,
      icon: MdTrendingUp,
      color: "text-orange-400",
      iconBg: "bg-orange-500/20",
    },
  ];

  const apartmentChartData = {
    labels: charts.apartmentStats.map((a) =>
      a.status.replace("_", " ")
    ),
    datasets: [
      {
        data: charts.apartmentStats.map((a) => a.count),
        backgroundColor: CHART_COLORS,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const workerChartData = {
    labels: charts.workersBySpecialization.map((w) => w.specialization),
    datasets: [
      {
        label: "Workers",
        data: charts.workersBySpecialization.map((w) => w.count),
        backgroundColor: CHART_COLORS,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#a0a4ab", font: { size: 11 } },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: { color: "#737882", font: { size: 10 } },
        grid: { color: "#282d38" },
      },
      y: {
        ticks: { color: "#737882", font: { size: 10 } },
        grid: { color: "#282d38" },
      },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          Real-time snapshot of your construction empire
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-hover">
              <div className="flex items-start gap-3">
                <div
                  className={`stat-icon ${card.iconBg} flex-shrink-0`}
                >
                  <Icon className={`text-2xl ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <div
                    className={`font-bold ${card.isLarge ? "text-lg" : "text-2xl"} ${card.color}`}
                  >
                    {card.value}
                  </div>
                  <div className="text-xs text-dark-400 mt-0.5">
                    {card.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-brand-500/10 to-brand-600/5 border-brand-500/20">
          <p className="text-dark-400 text-sm">Total Expenditure</p>
          <p className="text-2xl font-bold text-brand-400 mt-1">
            {formatCurrency(stats.totalExpenditure)}
          </p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Worker Payments</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {formatCurrency(stats.totalWorkerPayments)}
          </p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Owner Payments</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {formatCurrency(stats.totalOwnerPayments)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apartment Status */}
        <div className="card">
          <h3 className="font-semibold text-dark-100 mb-4">Apartment Status</h3>
          <div style={{ height: "220px" }}>
            <Doughnut data={apartmentChartData} options={chartOptions} />
          </div>
        </div>

        {/* Workers by Specialization */}
        <div className="card">
          <h3 className="font-semibold text-dark-100 mb-4">
            Workers by Specialization
          </h3>
          <div style={{ height: "220px" }}>
            <Bar data={workerChartData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Buildings */}
        <div className="card">
          <h3 className="font-semibold text-dark-100 mb-4">
            Top Buildings by Cost
          </h3>
          <div className="space-y-3">
            {topBuildings.map((building) => (
              <div key={building.BuildingID} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-dark-100">
                      {building.ProjectName}
                    </p>
                    <p className="text-xs text-dark-500">{building.Location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-400">
                      {formatCurrency(Number(building.TotalCost))}
                    </p>
                    <p className="text-xs text-dark-500">
                      {building.soldApartments}/{building.totalApartments} sold
                    </p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(building.avgProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-dark-500">
                  {building.avgProgress.toFixed(1)}% avg. progress
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card">
          <h3 className="font-semibold text-dark-100 mb-4">Recent Payments</h3>
          <div className="space-y-2">
            {recentPayments.map((payment) => (
              <div
                key={payment.PaymentID}
                className="flex items-center justify-between py-2.5 border-b border-dark-700/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-dark-100">
                    {payment.Workers?.FullName || "Unknown Worker"}
                  </p>
                  <p className="text-xs text-dark-500">
                    {formatDate(payment.PaymentDate)} · {payment.PaymentMethod}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-400">
                  {formatCurrency(Number(payment.AmountPaid))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
