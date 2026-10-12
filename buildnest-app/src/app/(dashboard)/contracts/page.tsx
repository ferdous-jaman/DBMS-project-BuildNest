"use client";

import { useEffect, useState, useCallback } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdGavel } from "react-icons/md";
import toast from "react-hot-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

interface Contract {
  ContractID: number;
  ContractorName: string;
  StartDate: string;
  EndDate: string;
  TotalAmount: number;
  Status: string;
  Terms: string;
  Buildings: { ProjectName: string; Location: string } | null;
}

const CONTRACT_STATUSES = ["Active", "Completed", "Terminated", "Pending"];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [form, setForm] = useState({ ContractorName: "", BuildingID: "", StartDate: "", EndDate: "", TotalAmount: "", Status: "Pending", Terms: "" });

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    try {
      const res = await fetch(`/api/contracts?${params}`);
      const data = await res.json();
      setContracts(data.contracts || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const openAddModal = () => {
    setEditContract(null);
    setForm({ ContractorName: "", BuildingID: "", StartDate: "", EndDate: "", TotalAmount: "", Status: "Pending", Terms: "" });
    setShowModal(true);
  };

  const openEditModal = (c: Contract) => {
    setEditContract(c);
    setForm({
      ContractorName: c.ContractorName || "", BuildingID: "",
      StartDate: c.StartDate?.split("T")[0] || "", EndDate: c.EndDate?.split("T")[0] || "",
      TotalAmount: String(c.TotalAmount || ""), Status: c.Status || "Pending", Terms: c.Terms || ""
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const method = editContract ? "PUT" : "POST";
    const body = editContract ? { ...form, ContractID: editContract.ContractID } : form;
    const res = await fetch("/api/contracts", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(editContract ? "Contract updated!" : "Contract added!"); setShowModal(false); fetchContracts(); }
    else toast.error("Failed to save contract");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contract?")) return;
    const res = await fetch(`/api/contracts?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Contract deleted!"); fetchContracts(); }
    else toast.error("Failed to delete");
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><MdGavel className="text-brand-400" /> Contracts</h1>
          <p className="page-subtitle">{total} legal agreements</p>
        </div>
        <button onClick={openAddModal} className="btn-primary"><MdAdd /> Add Contract</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
          <input type="text" placeholder="Search by contractor or building..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="select-field w-auto min-w-36">
          <option value="">All Statuses</option>
          {CONTRACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Contractor</th>
              <th>Building</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j}><div className="skeleton h-4" /></td>)}</tr>)
            ) : contracts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-dark-500">No contracts found</td></tr>
            ) : (
              contracts.map((c) => (
                <tr key={c.ContractID}>
                  <td className="text-dark-500 text-xs">{c.ContractID}</td>
                  <td className="font-medium text-dark-100">{c.ContractorName}</td>
                  <td className="text-dark-400 text-xs">{c.Buildings?.ProjectName || "—"}</td>
                  <td className="text-brand-400 font-semibold">{formatCurrency(Number(c.TotalAmount))}</td>
                  <td>{formatDate(c.StartDate)}</td>
                  <td>{formatDate(c.EndDate)}</td>
                  <td><span className={`badge ${getStatusColor(c.Status || "")}`}>{c.Status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(c)} className="text-dark-400 hover:text-brand-400"><MdEdit /></button>
                      <button onClick={() => handleDelete(c.ContractID)} className="text-dark-400 hover:text-red-400"><MdDelete /></button>
                    </div>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-semibold text-dark-50">{editContract ? "Edit Contract" : "Add New Contract"}</h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-100 text-xl">×</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Contractor Name</label>
                  <input className="input-field" placeholder="Company name" value={form.ContractorName} onChange={e => setForm(f => ({ ...f, ContractorName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Building ID</label>
                  <input type="number" className="input-field" placeholder="e.g. 1" value={form.BuildingID} onChange={e => setForm(f => ({ ...f, BuildingID: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Total Amount (৳)</label>
                  <input type="number" className="input-field" placeholder="5000000" value={form.TotalAmount} onChange={e => setForm(f => ({ ...f, TotalAmount: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input-field" value={form.StartDate} onChange={e => setForm(f => ({ ...f, StartDate: e.target.value }))} />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input-field" value={form.EndDate} onChange={e => setForm(f => ({ ...f, EndDate: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Status</label>
                  <select className="select-field" value={form.Status} onChange={e => setForm(f => ({ ...f, Status: e.target.value }))}>
                    {CONTRACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Terms & Conditions</label>
                  <textarea className="input-field h-24 resize-none" placeholder="Contract terms..." value={form.Terms} onChange={e => setForm(f => ({ ...f, Terms: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 justify-center">{editContract ? "Update" : "Add Contract"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
