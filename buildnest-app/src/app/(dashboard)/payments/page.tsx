"use client";

import { useEffect, useState } from "react";
import { MdPayments, MdPeople, MdBusiness } from "react-icons/md";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

interface PaymentData {
  workerPayments: {
    PaymentID: number;
    AmountPaid: number;
    PaymentDate: string;
    PaymentMethod: string;
    Workers: { FullName: string; Specialization: string } | null;
  }[];
  ownerPayments: {
    PaymentID: number;
    Amount: number;
    PaymentDate: string;
    PaymentMethod: string;
    Owners: { FullName: string } | null;
  }[];
  stats: {
    totalWorkerPay: number;
    totalOwnerPay: number;
    workerPaymentCount: number;
    ownerPaymentCount: number;
  };
}

const METHOD_COLORS: Record<string, string> = {
  Cash: "bg-green-500/20 text-green-400 border border-green-500/30",
  "Bank Transfer": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  bKash: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
  Nagad: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"worker" | "owner">("worker");

  useEffect(() => {
    fetch("/api/payments/worker")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>;
  if (!data) return <div className="text-dark-400">Failed to load payment data</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2"><MdPayments className="text-brand-400" /> Payments</h1>
        <p className="page-subtitle">Track all worker and owner financial transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-dark-400 text-xs">Worker Payments Total</p>
          <p className="text-xl font-bold text-green-400 mt-1">{formatCurrency(data.stats.totalWorkerPay)}</p>
          <p className="text-xs text-dark-500 mt-0.5">{data.stats.workerPaymentCount} transactions</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-xs">Owner Payments Total</p>
          <p className="text-xl font-bold text-blue-400 mt-1">{formatCurrency(data.stats.totalOwnerPay)}</p>
          <p className="text-xs text-dark-500 mt-0.5">{data.stats.ownerPaymentCount} transactions</p>
        </div>
        <div className="card col-span-2">
          <p className="text-dark-400 text-xs">Total Expenditure</p>
          <p className="text-xl font-bold text-brand-400 mt-1">{formatCurrency(data.stats.totalWorkerPay + data.stats.totalOwnerPay)}</p>
          <p className="text-xs text-dark-500 mt-0.5">{data.stats.workerPaymentCount + data.stats.ownerPaymentCount} total transactions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab("worker")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "worker" ? "bg-brand-500 text-dark-950" : "text-dark-400 hover:text-dark-100"}`}>
          <MdPeople /> Worker Payments
        </button>
        <button onClick={() => setActiveTab("owner")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "owner" ? "bg-brand-500 text-dark-950" : "text-dark-400 hover:text-dark-100"}`}>
          <MdBusiness /> Owner Payments
        </button>
      </div>

      {/* Worker Payments Table */}
      {activeTab === "worker" && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Worker Name</th>
                <th>Specialization</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {data.workerPayments.map(p => (
                <tr key={p.PaymentID}>
                  <td className="text-dark-500 text-xs">{p.PaymentID}</td>
                  <td className="font-medium text-dark-100">{p.Workers?.FullName || "—"}</td>
                  <td className="text-dark-400">{p.Workers?.Specialization || "—"}</td>
                  <td className="text-green-400 font-semibold">{formatCurrency(Number(p.AmountPaid))}</td>
                  <td>{formatDate(p.PaymentDate)}</td>
                  <td>
                    <span className={`badge ${METHOD_COLORS[p.PaymentMethod] || "bg-dark-700 text-dark-300"}`}>
                      {p.PaymentMethod?.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Owner Payments Table */}
      {activeTab === "owner" && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Owner Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {data.ownerPayments.map(p => (
                <tr key={p.PaymentID}>
                  <td className="text-dark-500 text-xs">{p.PaymentID}</td>
                  <td className="font-medium text-dark-100">{p.Owners?.FullName || "—"}</td>
                  <td className="text-blue-400 font-semibold">{formatCurrency(Number(p.Amount))}</td>
                  <td>{formatDate(p.PaymentDate)}</td>
                  <td>
                    <span className={`badge ${METHOD_COLORS[p.PaymentMethod?.replace("_", " ")] || "bg-dark-700 text-dark-300"}`}>
                      {p.PaymentMethod?.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
