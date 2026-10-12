"use client";

import { useEffect, useState, useCallback } from "react";
import { MdPrecisionManufacturing } from "react-icons/md";
import toast from "react-hot-toast";
import { formatDate, getStatusColor } from "@/lib/utils";

interface Equipment {
  EquipmentID: number;
  EquipmentName: string;
  Category: string;
  EquipmentCondition: string;
  AvailabilityStatus: string;
  Equipment_Usage_Log: {
    UsageLogID: number;
    Purpose: string;
    StartDate: string;
    EndDate: string;
    Workers: { FullName: string } | null;
  }[];
}

const EQUIPMENT_STATUSES = ["Available", "In Use", "Under Maintenance"];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/equipment?${params}`);
      const data = await res.json();
      setEquipment(data.equipment || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchEquipment(); }, [fetchEquipment]);

  const handleStatusUpdate = async (id: number, status: string) => {
    const res = await fetch("/api/equipment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ EquipmentID: id, AvailabilityStatus: status }),
    });
    if (res.ok) { toast.success("Equipment status updated!"); fetchEquipment(); }
    else toast.error("Failed to update status");
  };

  const STATUS_ICONS: Record<string, string> = {
    Available: "🟢",
    "In Use": "🟡",
    "Under Maintenance": "🔴",
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2"><MdPrecisionManufacturing className="text-brand-400" /> Equipment</h1>
        <p className="page-subtitle">{total} machinery and tools registered</p>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {[{ value: "", label: "All" }, ...EQUIPMENT_STATUSES.map(s => ({ value: s, label: s }))].map(opt => (
          <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setPage(1); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${statusFilter === opt.value ? "bg-brand-500 text-dark-950" : "text-dark-400 hover:text-dark-100"}`}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="skeleton h-44 rounded-xl" />)
        ) : equipment.length === 0 ? (
          <div className="col-span-full text-center py-12 text-dark-500">No equipment found</div>
        ) : (
          equipment.map((eq) => (
            <div key={eq.EquipmentID} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-dark-50">{eq.EquipmentName}</h3>
                  <p className="text-xs text-dark-500 mt-0.5">{eq.Category}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{STATUS_ICONS[eq.AvailabilityStatus?.replace("_", " ")] || "⚪"}</span>
                  <span className={`badge ${getStatusColor(eq.AvailabilityStatus?.replace("_", " ") || "")}`}>
                    {eq.AvailabilityStatus?.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <span className={`badge ${eq.EquipmentCondition === "New" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-dark-700 text-dark-400"}`}>
                  {eq.EquipmentCondition}
                </span>
              </div>

              {eq.Equipment_Usage_Log.length > 0 && (
                <div className="bg-dark-700/30 rounded-lg p-2.5 mb-3">
                  <p className="text-xs text-dark-500 mb-1.5">Last Usage</p>
                  <p className="text-xs text-dark-300">{eq.Equipment_Usage_Log[0].Purpose}</p>
                  <p className="text-xs text-dark-500 mt-1">by {eq.Equipment_Usage_Log[0].Workers?.FullName} · {formatDate(eq.Equipment_Usage_Log[0].StartDate)}</p>
                </div>
              )}

              <div className="flex gap-2">
                {EQUIPMENT_STATUSES.filter(s => s !== eq.AvailabilityStatus?.replace("_", " ")).map(s => (
                  <button key={s} onClick={() => handleStatusUpdate(eq.EquipmentID, s)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 transition-colors truncate">
                    → {s}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1.5 px-3 disabled:opacity-40">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1.5 px-3 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
