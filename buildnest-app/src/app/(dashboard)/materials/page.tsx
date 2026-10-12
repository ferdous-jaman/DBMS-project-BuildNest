"use client";

import { useEffect, useState, useCallback } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdInventory, MdWarning } from "react-icons/md";
import toast from "react-hot-toast";
import { formatCurrency, getStatusColor } from "@/lib/utils";

interface Material {
  MaterialID: number;
  MaterialName: string;
  Category: string;
  UnitPrice: number;
  StockQuantity: number;
  totalUsed: number;
  totalOrdered: number;
  Buildings: { ProjectName: string } | null;
}

const CATEGORIES = ["Building Material", "Construction Material", "Finishing Material", "Plumbing Material", "Electrical Material"];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [form, setForm] = useState({ MaterialName: "", Category: "", UnitPrice: "", StockQuantity: "", BuildingID: "" });

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/materials?${params}`);
      const data = await res.json();
      setMaterials(data.materials || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const openAddModal = () => {
    setEditMaterial(null);
    setForm({ MaterialName: "", Category: "", UnitPrice: "", StockQuantity: "", BuildingID: "" });
    setShowModal(true);
  };

  const openEditModal = (m: Material) => {
    setEditMaterial(m);
    setForm({ MaterialName: m.MaterialName || "", Category: m.Category || "", UnitPrice: String(m.UnitPrice || ""), StockQuantity: String(m.StockQuantity || ""), BuildingID: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    const method = editMaterial ? "PUT" : "POST";
    const body = editMaterial ? { ...form, MaterialID: editMaterial.MaterialID } : form;
    const res = await fetch("/api/materials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(editMaterial ? "Material updated!" : "Material added!"); setShowModal(false); fetchMaterials(); }
    else toast.error("Failed to save material");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this material?")) return;
    const res = await fetch(`/api/materials?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Material deleted!"); fetchMaterials(); }
    else toast.error("Failed to delete material");
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><MdInventory className="text-brand-400" /> Materials</h1>
          <p className="page-subtitle">{total} materials in inventory</p>
        </div>
        <button onClick={openAddModal} className="btn-primary"><MdAdd /> Add Material</button>
      </div>

      <div className="relative">
        <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" placeholder="Search by material name or category..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Material</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Stock</th>
              <th>Total Used</th>
              <th>Building</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j}><div className="skeleton h-4" /></td>)}</tr>)
            ) : materials.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-dark-500">No materials found</td></tr>
            ) : (
              materials.map((m) => (
                <tr key={m.MaterialID}>
                  <td className="text-dark-500 text-xs">{m.MaterialID}</td>
                  <td className="font-medium text-dark-100">
                    <div className="flex items-center gap-2">
                      {(m.StockQuantity || 0) < 50 && <MdWarning className="text-yellow-400 text-sm" title="Low stock" />}
                      {m.MaterialName}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-dark-700 text-dark-300">{m.Category}</span>
                  </td>
                  <td className="text-brand-400">{formatCurrency(Number(m.UnitPrice))}</td>
                  <td>
                    <span className={(m.StockQuantity || 0) < 50 ? "text-yellow-400 font-semibold" : "text-dark-200"}>
                      {m.StockQuantity?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td className="text-dark-400">{m.totalUsed}</td>
                  <td className="text-dark-400 text-xs">{m.Buildings?.ProjectName || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(m)} className="text-dark-400 hover:text-brand-400"><MdEdit /></button>
                      <button onClick={() => handleDelete(m.MaterialID)} className="text-dark-400 hover:text-red-400"><MdDelete /></button>
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
              <h2 className="text-lg font-semibold text-dark-50">{editMaterial ? "Edit Material" : "Add New Material"}</h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-100 text-xl">×</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Material Name</label>
                  <input className="input-field" placeholder="e.g. Cement" value={form.MaterialName} onChange={e => setForm(f => ({ ...f, MaterialName: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="select-field" value={form.Category} onChange={e => setForm(f => ({ ...f, Category: e.target.value }))}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Unit Price (৳)</label>
                  <input type="number" className="input-field" placeholder="420" value={form.UnitPrice} onChange={e => setForm(f => ({ ...f, UnitPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Stock Quantity</label>
                  <input type="number" className="input-field" placeholder="1000" value={form.StockQuantity} onChange={e => setForm(f => ({ ...f, StockQuantity: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Building ID</label>
                  <input type="number" className="input-field" placeholder="e.g. 1" value={form.BuildingID} onChange={e => setForm(f => ({ ...f, BuildingID: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 justify-center">{editMaterial ? "Update" : "Add Material"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
