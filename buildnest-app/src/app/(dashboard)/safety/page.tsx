"use client";

import { useEffect, useState, useCallback } from "react";
import { MdWarning, MdCheck, MdSearch } from "react-icons/md";
import toast from "react-hot-toast";
import { formatDate, getStatusColor } from "@/lib/utils";

interface Incident {
  IncidentID: number;
  IncidentDate: string;
  IncidentType: string;
  ResolutionStatus: string;
  Workers: { FullName: string; Specialization: string; Sector_Heads: { Sector: string } | null } | null;
}

interface SafetyStats { ResolutionStatus: string; _count: { IncidentID: number } }

export default function SafetyPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<SafetyStats[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/safety?${params}`);
      const data = await res.json();
      setIncidents(data.incidents || []);
      setStats(data.stats || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const handleResolve = async (id: number) => {
    const res = await fetch("/api/safety", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IncidentID: id, ResolutionStatus: "Resolved" }),
    });
    if (res.ok) { toast.success("Incident marked as resolved!"); fetchIncidents(); }
    else toast.error("Failed to update incident");
  };

  const resolved = stats.find(s => s.ResolutionStatus === "Resolved")?._count.IncidentID || 0;
  const unresolved = stats.find(s => s.ResolutionStatus === "Unresolved")?._count.IncidentID || 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2"><MdWarning className="text-brand-400" /> Safety Incidents</h1>
        <p className="page-subtitle">Monitor and resolve workplace safety issues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-red-500">
          <p className="text-dark-400 text-xs">Unresolved</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{unresolved}</p>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <p className="text-dark-400 text-xs">Resolved</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{resolved}</p>
        </div>
        <div className="card border-l-4 border-l-brand-500">
          <p className="text-dark-400 text-xs">Total Incidents</p>
          <p className="text-2xl font-bold text-brand-400 mt-1">{resolved + unresolved}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {[{ value: "", label: "All" }, { value: "Unresolved", label: "Unresolved" }, { value: "Resolved", label: "Resolved" }].map(opt => (
          <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${statusFilter === opt.value ? "bg-brand-500 text-dark-950" : "text-dark-400 hover:text-dark-100"}`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Worker</th>
              <th>Specialization</th>
              <th>Sector</th>
              <th>Incident Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j}><div className="skeleton h-4" /></td>)}</tr>)
            ) : incidents.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-dark-500">No incidents found</td></tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc.IncidentID}>
                  <td className="text-dark-500 text-xs">{inc.IncidentID}</td>
                  <td className="font-medium text-dark-100">{inc.Workers?.FullName || "—"}</td>
                  <td className="text-dark-400">{inc.Workers?.Specialization || "—"}</td>
                  <td className="text-dark-400 text-xs">{inc.Workers?.Sector_Heads?.Sector || "—"}</td>
                  <td className="max-w-48 truncate" title={inc.IncidentType}>{inc.IncidentType}</td>
                  <td>{formatDate(inc.IncidentDate)}</td>
                  <td>
                    <span className={`badge ${getStatusColor(inc.ResolutionStatus || "")}`}>
                      {inc.ResolutionStatus}
                    </span>
                  </td>
                  <td>
                    {inc.ResolutionStatus === "Unresolved" && (
                      <button onClick={() => handleResolve(inc.IncidentID)}
                        className="flex items-center gap-1.5 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-2.5 py-1.5 rounded-lg transition-all">
                        <MdCheck className="text-sm" /> Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
