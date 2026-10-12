"use client";

import { useEffect, useState, useCallback } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdBusiness, MdPhone, MdEmail } from "react-icons/md";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";

interface Owner {
  OwnerID: number;
  FullName: string;
  Phone: string;
  Email: string;
  ResidentialAddress: string;
  TotalInvestment: number;
  totalPaid: number;
  unpaidInvoices: number;
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editOwner, setEditOwner] = useState<Owner | null>(null);
  const [form, setForm] = useState({ FullName: "", Phone: "", Email: "", ResidentialAddress: "", TotalInvestment: "" });

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/owners?${params}`);
      const data = await res.json();
      setOwners(data.owners || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchOwners(); }, [fetchOwners]);

  const openAddModal = () => {
    setEditOwner(null);
    setForm({ FullName: "", Phone: "", Email: "", ResidentialAddress: "", TotalInvestment: "" });
    setShowModal(true);
  };

  const openEditModal = (o: Owner) => {
    setEditOwner(o);
    setForm({ FullName: o.FullName, Phone: o.Phone, Email: o.Email || "", ResidentialAddress: o.ResidentialAddress || "", TotalInvestment: String(o.TotalInvestment || "") });
    setShowModal(true);
  };

  const handleSave = async () => {
    const method = editOwner ? "PUT" : "POST";
    const body = editOwner ? { ...form, OwnerID: editOwner.OwnerID } : form;
    const res = await fetch("/api/owners", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(editOwner ? "Owner updated!" : "Owner added!"); setShowModal(false); fetchOwners(); }
    else toast.error("Failed to save owner");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this owner?")) return;
    const res = await fetch(`/api/owners?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Owner deleted!"); fetchOwners(); }
    else toast.error("Failed to delete owner");
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><MdBusiness className="text-brand-400" /> Owners</h1>
          <p className="page-subtitle">{total} property owners registered</p>
        </div>
        <button onClick={openAddModal} className="btn-primary"><MdAdd /> Add Owner</button>
      </div>

      <div className="relative">
        <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" placeholder="Search by name, email or phone..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)
        ) : owners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-dark-500">No owners found</div>
        ) : (
          owners.map((o) => (
            <div key={o.OwnerID} className="card-hover group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-400 font-bold text-lg">{o.FullName?.[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-50">{o.FullName}</h3>
                    <p className="text-xs text-dark-500">{o.ResidentialAddress}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(o)} className="p-1.5 text-dark-400 hover:text-brand-400 rounded"><MdEdit /></button>
                  <button onClick={() => handleDelete(o.OwnerID)} className="p-1.5 text-dark-400 hover:text-red-400 rounded"><MdDelete /></button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-400">
                  <MdPhone className="text-dark-500" />
                  <span>{o.Phone}</span>
                </div>
                {o.Email && (
                  <div className="flex items-center gap-2 text-xs text-dark-400">
                    <MdEmail className="text-dark-500" />
                    <span>{o.Email}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-dark-700/50 rounded-lg p-2.5">
                  <p className="text-dark-500">Investment</p>
                  <p className="text-brand-400 font-bold mt-0.5">{formatCurrency(Number(o.TotalInvestment))}</p>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-2.5">
                  <p className="text-dark-500">Total Paid</p>
                  <p className="text-green-400 font-bold mt-0.5">{formatCurrency(o.totalPaid)}</p>
                </div>
              </div>
              {o.unpaidInvoices > 0 && (
                <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  ⚠ {o.unpaidInvoices} unpaid invoice{o.unpaidInvoices > 1 ? "s" : ""}
                </div>
              )}
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-semibold text-dark-50">{editOwner ? "Edit Owner" : "Add New Owner"}</h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-100 text-xl">×</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Full Name</label>
                  <input className="input-field" placeholder="Full name" value={form.FullName} onChange={e => setForm(f => ({ ...f, FullName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" placeholder="01XXXXXXXXX" value={form.Phone} onChange={e => setForm(f => ({ ...f, Phone: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input-field" placeholder="email@example.com" value={form.Email} onChange={e => setForm(f => ({ ...f, Email: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Residential Address</label>
                  <input className="input-field" placeholder="Full address" value={form.ResidentialAddress} onChange={e => setForm(f => ({ ...f, ResidentialAddress: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Total Investment (৳)</label>
                  <input type="number" className="input-field" placeholder="2500000" value={form.TotalInvestment} onChange={e => setForm(f => ({ ...f, TotalInvestment: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 justify-center">{editOwner ? "Update Owner" : "Add Owner"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
