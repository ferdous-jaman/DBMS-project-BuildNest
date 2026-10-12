"use client";

import { useEffect, useState, useCallback } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdPeople } from "react-icons/md";
import toast from "react-hot-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

interface Worker {
  WorkerID: number;
  FullName: string;
  Specialization: string;
  Phone: string;
  Address: string;
  DailyWage: number;
  WorkStatus: string;
  totalPaid: number;
  presentDays: number;
  Sector_Heads: { FullName: string; Sector: string; Buildings: { ProjectName: string } | null } | null;
}

const SPECIALIZATIONS = ["Mason", "Plumber", "Electrician", "Painter", "Carpenter"];
const STATUS_OPTIONS = ["Active", "On Leave"];

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editWorker, setEditWorker] = useState<Worker | null>(null);
  const [form, setForm] = useState({
    FullName: "", Specialization: "", Phone: "", Address: "", DailyWage: "", WorkStatus: "Active"
  });

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    try {
      const res = await fetch(`/api/workers?${params}`);
      const data = await res.json();
      setWorkers(data.workers || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const openAddModal = () => {
    setEditWorker(null);
    setForm({ FullName: "", Specialization: "", Phone: "", Address: "", DailyWage: "", WorkStatus: "Active" });
    setShowModal(true);
  };

  const openEditModal = (w: Worker) => {
    setEditWorker(w);
    setForm({
      FullName: w.FullName || "",
      Specialization: w.Specialization || "",
      Phone: w.Phone || "",
      Address: w.Address || "",
      DailyWage: String(w.DailyWage || ""),
      WorkStatus: w.WorkStatus || "Active",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const method = editWorker ? "PUT" : "POST";
    const body = editWorker ? { ...form, WorkerID: editWorker.WorkerID } : form;
    const res = await fetch("/api/workers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success(editWorker ? "Worker updated!" : "Worker added!");
      setShowModal(false);
      fetchWorkers();
    } else {
      toast.error("Failed to save worker");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this worker?")) return;
    const res = await fetch(`/api/workers?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Worker deleted!");
      fetchWorkers();
    } else {
      toast.error("Failed to delete worker");
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MdPeople className="text-brand-400" /> Workers
          </h1>
          <p className="page-subtitle">{total} workers registered in the system</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <MdAdd /> Add Worker
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search by name, specialization or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="select-field w-auto min-w-36">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Phone</th>
              <th>Daily Wage</th>
              <th>Total Paid</th>
              <th>Attendance</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(10)].map((_, j) => (
                    <td key={j}><div className="skeleton h-4 w-full" /></td>
                  ))}
                </tr>
              ))
            ) : workers.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-dark-500">No workers found</td></tr>
            ) : (
              workers.map((w) => (
                <tr key={w.WorkerID}>
                  <td className="text-dark-500 text-xs">{w.WorkerID}</td>
                  <td className="font-medium text-dark-100">{w.FullName}</td>
                  <td>{w.Specialization}</td>
                  <td>{w.Phone}</td>
                  <td className="text-brand-400">{formatCurrency(Number(w.DailyWage))}/day</td>
                  <td className="text-green-400">{formatCurrency(w.totalPaid)}</td>
                  <td>{w.presentDays} days</td>
                  <td className="text-dark-400 text-xs">{w.Sector_Heads?.Sector || "—"}</td>
                  <td>
                    <span className={`badge ${getStatusColor(w.WorkStatus?.replace("_", " ") || "")}`}>
                      {w.WorkStatus?.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(w)} className="text-dark-400 hover:text-brand-400 transition-colors">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleDelete(w.WorkerID)} className="text-dark-400 hover:text-red-400 transition-colors">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-400">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1.5 px-3 disabled:opacity-40">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1.5 px-3 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-semibold text-dark-50">{editWorker ? "Edit Worker" : "Add New Worker"}</h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-100 text-xl">×</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input-field" placeholder="Full name" value={form.FullName} onChange={e => setForm(f => ({ ...f, FullName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Specialization</label>
                  <select className="select-field" value={form.Specialization} onChange={e => setForm(f => ({ ...f, Specialization: e.target.value }))}>
                    <option value="">Select</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" placeholder="01XXXXXXXXX" value={form.Phone} onChange={e => setForm(f => ({ ...f, Phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Daily Wage (৳)</label>
                  <input type="number" className="input-field" placeholder="1200" value={form.DailyWage} onChange={e => setForm(f => ({ ...f, DailyWage: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Address</label>
                  <input className="input-field" placeholder="Full address" value={form.Address} onChange={e => setForm(f => ({ ...f, Address: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Work Status</label>
                  <select className="select-field" value={form.WorkStatus} onChange={e => setForm(f => ({ ...f, WorkStatus: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                  {editWorker ? "Update Worker" : "Add Worker"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
