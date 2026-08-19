import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Pagination from "../common/Pagination";
import {
  FiCreditCard,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiEdit3,
  FiDollarSign,
  FiUser,
  FiUsers,
} from "react-icons/fi";

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState({
    totalInvestment: 0,
    habibTotal: 0,
    robiulTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    purchaser: "JOINT",
    totalCost: "",
    habibContribution: "",
    robiulContribution: "",
    notes: "",
    investmentDate: new Date().toISOString().slice(0, 10),
  });

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/investments?page=${page}&limit=${limit}&search=${searchQuery}`
      );
      if (res.data.success) {
        setInvestments(res.data.data);
        setMeta(res.data.meta);
        setSummary(
          res.data.summary || { totalInvestment: 0, habibTotal: 0, robiulTotal: 0 }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [page, limit, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-split logic when purchaser changes
      if (name === "purchaser") {
        const cost = Number(updated.totalCost || 0);
        if (value === "HABIB") {
          updated.habibContribution = cost;
          updated.robiulContribution = 0;
        } else if (value === "ROBIUL") {
          updated.robiulContribution = cost;
          updated.habibContribution = 0;
        }
      } else if (name === "totalCost") {
        const cost = Number(value || 0);
        if (updated.purchaser === "HABIB") {
          updated.habibContribution = cost;
          updated.robiulContribution = 0;
        } else if (updated.purchaser === "ROBIUL") {
          updated.robiulContribution = cost;
          updated.habibContribution = 0;
        }
      }

      return updated;
    });
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      description: "",
      purchaser: "JOINT",
      totalCost: "",
      habibContribution: "",
      robiulContribution: "",
      notes: "",
      investmentDate: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      description: item.description,
      purchaser: item.purchaser,
      totalCost: item.totalCost,
      habibContribution: item.habibContribution,
      robiulContribution: item.robiulContribution,
      notes: item.notes || "",
      investmentDate: new Date(item.investmentDate).toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/investments/${editingId}`, formData);
      } else {
        await api.post("/investments", formData);
      }
      setIsModalOpen(false);
      fetchInvestments();
    } catch (err) {
      alert("Failed to save investment record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this investment entry?")) return;
    try {
      await api.delete(`/investments/${id}`);
      fetchInvestments();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiCreditCard className="w-4 h-4 text-slate-500" />
            Partnership Investment Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking contributions and expenses between Habib & Robiul.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInvestments}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5" />
            New Expense / Investment
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Total Partnership Investment
          </span>
          <span className="text-2xl font-bold font-mono mt-1 block">
            ৳{summary.totalInvestment?.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block flex items-center gap-1">
            <FiUser className="w-3.5 h-3.5 text-slate-400" /> Habib Contribution
          </span>
          <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
            ৳{summary.habibTotal?.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block flex items-center gap-1">
            <FiUser className="w-3.5 h-3.5 text-slate-400" /> Robiul Contribution
          </span>
          <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
            ৳{summary.robiulTotal?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xs">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search description or notes..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {/* Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Product Description</th>
                <th className="py-3 px-4 text-center">Purchaser</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-right text-slate-600">Habib Contribution</th>
                <th className="py-3 px-4 text-right text-slate-600">Robiul Contribution</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : investments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No investment records found.
                  </td>
                </tr>
              ) : (
                investments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(item.investmentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.description}
                      {item.notes && (
                        <div className="text-[10px] text-slate-400 font-normal">{item.notes}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md">
                        {item.purchaser}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold font-mono text-slate-900">
                      ৳{item.totalCost?.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {item.habibContribution > 0 ? `৳${item.habibContribution.toLocaleString()}` : "—"}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {item.robiulContribution > 0 ? `৳${item.robiulContribution.toLocaleString()}` : "—"}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-4">
          <Pagination
            meta={meta}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-slate-500" />
                {editingId ? "Edit Expense Entry" : "New Partnership Expense"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Product Description *</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. Move on Purchase / Ad Cost"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Purchaser *</label>
                  <select
                    name="purchaser"
                    value={formData.purchaser}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <option value="JOINT">Joint</option>
                    <option value="HABIB">Habib</option>
                    <option value="ROBIUL">Robiul</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Total Cost (৳) *</label>
                  <input
                    type="number"
                    name="totalCost"
                    min="0"
                    required
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Habib Contribution (৳)</label>
                  <input
                    type="number"
                    name="habibContribution"
                    min="0"
                    value={formData.habibContribution}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Robiul Contribution (৳)</label>
                  <input
                    type="number"
                    name="robiulContribution"
                    min="0"
                    value={formData.robiulContribution}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Date *</label>
                <input
                  type="date"
                  name="investmentDate"
                  required
                  value={formData.investmentDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-xl"
                >
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}