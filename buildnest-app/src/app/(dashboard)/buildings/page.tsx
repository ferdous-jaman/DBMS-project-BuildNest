"use client";

import { useEffect, useState, useCallback } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdApartment } from "react-icons/md";
import toast from "react-hot-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

interface Building {
  BuildingID: number;
  ProjectName: string;
  Location: string;
  NumberOfFloors: number;
  NumberOfApartments: number;
  TotalCost: number;
  StartDate: string;
  ExpectedCompletionDate: string;
  Apartments: { Status: string }[];
  Project_Stages: { StageName: string; Progress: number }[];
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBuilding, setEditBuilding] = useState<Building | null>(null);
  const [form, setForm] = useState({
    ProjectName: "", Location: "", NumberOfFloors: "", NumberOfApartments: "",
    TotalCost: "", StartDate: "", ExpectedCompletionDate: ""
  });

  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/buildings?${params}`);
      const data = await res.json();
      setBuildings(data.buildings || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchBuildings(); }, [fetchBuildings]);

  const openAddModal = () => {
    setEditBuilding(null);
    setForm({ ProjectName: "", Location: "", NumberOfFloors: "", NumberOfApartments: "", TotalCost: "", StartDate: "", ExpectedCompletionDate: "" });
    setShowModal(true);
  };

  const openEditModal = (b: Building) => {
    setEditBuilding(b);
    setForm({
      ProjectName: b.ProjectName || "", Location: b.Location || "",
      NumberOfFloors: String(b.NumberOfFloors || ""), NumberOfApartments: String(b.NumberOfApartments || ""),
      TotalCost: String(b.TotalCost || ""),
      StartDate: b.StartDate ? b.StartDate.split("T")[0] : "",
      ExpectedCompletionDate: b.ExpectedCompletionDate ? b.ExpectedCompletionDate.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const method = editBuilding ? "PUT" : "POST";
    const body = editBuilding ? { ...form, BuildingID: editBuilding.BuildingID } : form;
    const res = await fetch("/api/buildings", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      toast.success(editBuilding ? "Building updated!" : "Building added!");
      setShowModal(false);
      fetchBuildings();
    } else {
      toast.error("Failed to save building");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this building? This will also delete all related data.")) return;
    const res = await fetch(`/api/buildings?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Building deleted!"); fetchBuildings(); }
    else toast.error("Cannot delete — related data exists.");
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><MdApartment className="text-brand-400" /> Buildings</h1>
          <p className="page-subtitle">{total} construction projects</p>
        </div>
        <button onClick={openAddModal} className="btn-primary"><MdAdd /> Add Building</button>
      </div>

      <div className="relative">
        <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" placeholder="Search by project name or location..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="skeleton h-52 rounded-xl" />)
        ) : buildings.length === 0 ? (
          <div className="col-span-full text-center py-12 text-dark-500">No buildings found</div>
        ) : (
          buildings.map((b) => {
            const sold = b.Apartments.filter(a => a.Status === "Sold").length;
            const avgProgress = b.Project_Stages.length > 0
              ? b.Project_Stages.reduce((sum, s) => sum + Number(s.Progress || 0), 0) / b.Project_Stages.length
              : 0;
            return (
              <div key={b.BuildingID} className="card-hover group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-dark-50">{b.ProjectName}</h3>
                    <p className="text-xs text-dark-500 mt-0.5">{b.Location}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(b)} className="p-1.5 text-dark-400 hover:text-brand-400 transition-colors rounded"><MdEdit /></button>
                    <button onClick={() => handleDelete(b.BuildingID)} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors rounded"><MdDelete /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-dark-700/50 rounded-lg p-2.5">
                    <p className="text-dark-500">Floors</p>
                    <p className="text-dark-100 font-semibold mt-0.5">{b.NumberOfFloors || "—"}</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2.5">
                    <p className="text-dark-500">Apartments</p>
                    <p className="text-dark-100 font-semibold mt-0.5">{sold}/{b.Apartments.length} sold</p>
                  </div>
                  <div className="bg-dark-700/50 rounded-lg p-2.5 col-span-2">
                    <p className="text-dark-500">Total Cost</p>
                    <p className="text-brand-400 font-bold mt-0.5">{formatCurrency(Number(b.TotalCost))}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-dark-400">
                    <span>Progress</span>
                    <span>{avgProgress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(avgProgress, 100)}%` }} />
                  </div>
                </div>

                <div className="flex justify-between mt-3 text-xs text-dark-500">
                  <span>Start: {formatDate(b.StartDate)}</span>
                  <span>ECD: {formatDate(b.ExpectedCompletionDate)}</span>
                </div>
              </div>
            );
          })
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
              <h2 className="text-lg font-semibold text-dark-50">{editBuilding ? "Edit Building" : "Add New Building"}</h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-100 text-xl">×</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Project Name</label>
                  <input className="input-field" placeholder="e.g. Skyline Tower" value={form.ProjectName} onChange={e => setForm(f => ({ ...f, ProjectName: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Location</label>
                  <input className="input-field" placeholder="e.g. Gulshan, Dhaka" value={form.Location} onChange={e => setForm(f => ({ ...f, Location: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Number of Floors</label>
                  <input type="number" className="input-field" placeholder="20" value={form.NumberOfFloors} onChange={e => setForm(f => ({ ...f, NumberOfFloors: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Number of Apartments</label>
                  <input type="number" className="input-field" placeholder="60" value={form.NumberOfApartments} onChange={e => setForm(f => ({ ...f, NumberOfApartments: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Total Cost (৳)</label>
                  <input type="number" className="input-field" placeholder="150000000" value={form.TotalCost} onChange={e => setForm(f => ({ ...f, TotalCost: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input-field" value={form.StartDate} onChange={e => setForm(f => ({ ...f, StartDate: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Expected Completion</label>
                  <input type="date" className="input-field" value={form.ExpectedCompletionDate} onChange={e => setForm(f => ({ ...f, ExpectedCompletionDate: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                  {editBuilding ? "Update Building" : "Add Building"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
