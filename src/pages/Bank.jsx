import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Pagination from "../components/common/Pagination";
import {
  FiDollarSign,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiEdit3,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCheckCircle,
} from "react-icons/fi";

export default function Bank() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    currentBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

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
    type: "INFLOW",
    amount: "",
    referenceNo: "",
    notes: "",
    transactionDate: new Date().toISOString().slice(0, 10),
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/bank?page=${page}&limit=${limit}&search=${searchQuery}&type=${typeFilter}`,
      );
      if (res.data.success) {
        setTransactions(res.data.data);
        setMeta(res.data.meta);
        setSummary(
          res.data.summary || {
            totalInflow: 0,
            totalOutflow: 0,
            currentBalance: 0,
          },
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, searchQuery, typeFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      description: "",
      type: "INFLOW",
      amount: "",
      referenceNo: "",
      notes: "",
      transactionDate: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      description: item.description,
      type: item.type,
      amount: item.amount,
      referenceNo: item.referenceNo || "",
      notes: item.notes || "",
      transactionDate: new Date(item.transactionDate)
        .toISOString()
        .slice(0, 10),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/bank/${editingId}`, formData);
      } else {
        await api.post("/bank", formData);
      }
      setIsModalOpen(false);
      fetchTransactions();
    } catch (err) {
      alert("Failed to save transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank entry?"))
      return;
    try {
      await api.delete(`/bank/${id}`);
      fetchTransactions();
    } catch (err) {
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-slate-500" />
            Bank & Treasury Balance Sheet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track bank account cash flows, manual debits/credits, and
            auto-credited order payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchTransactions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5" />
            New Entry
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Current Bank Balance
          </span>
          <span className="text-2xl font-bold font-mono mt-1 block">
            ৳{summary.currentBalance?.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
            <FiArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Total
            Credit (Inflow)
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
            +৳{summary.totalInflow?.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-rose-800 uppercase tracking-wider block flex items-center gap-1">
            <FiArrowUpRight className="w-3.5 h-3.5 text-rose-600" /> Total Debit
            (Outflow)
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block">
            -৳{summary.totalOutflow?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search description, reference..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="INFLOW">Credit (Inflow)</option>
            <option value="OUTFLOW">Debit (Outflow)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Reference No.</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No bank transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(item.transactionDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        {item.description}
                        {item.orderId && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[9px] font-medium rounded-md border border-emerald-200/60">
                            <FiCheckCircle className="w-2.5 h-2.5" /> Order
                            Auto-Credit
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <div className="text-[10px] text-slate-400">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                          item.type === "INFLOW"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                            : "bg-rose-50 text-rose-800 border border-rose-200/60"
                        }`}
                      >
                        {item.type === "INFLOW" ? "Credit" : "Debit"}
                      </span>
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-bold font-mono ${
                        item.type === "INFLOW"
                          ? "text-emerald-700"
                          : "text-rose-600"
                      }`}
                    >
                      {item.type === "INFLOW" ? "+" : "-"}৳
                      {item.amount?.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                      {item.referenceNo || "—"}
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
                {editingId ? "Edit Bank Transaction" : "New Bank Transaction"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. Deposit / Office Expense Payout"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                  >
                    <option value="INFLOW">Credit (Inflow)</option>
                    <option value="OUTFLOW">Debit (Outflow)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Amount (৳) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    required
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Reference No.
                  </label>
                  <input
                    type="text"
                    name="referenceNo"
                    placeholder="TRX-1002"
                    value={formData.referenceNo}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="transactionDate"
                    required
                    value={formData.transactionDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
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
                  {submitting ? "Saving..." : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
