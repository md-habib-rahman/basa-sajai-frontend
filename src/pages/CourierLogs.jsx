import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Pagination from "../common/Pagination";
import {
  FiList,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

export default function CourierLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/steadfast/logs?page=${page}&limit=${limit}&search=${searchQuery}`,
      );
      if (res.data.success) {
        setLogs(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error("Failed to fetch webhook logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit, searchQuery]);

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FiCheckCircle className="w-3 h-3" /> Delivered
        </span>
      );
    }
    if (s === "cancelled" || s === "returned") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <FiAlertCircle className="w-3 h-3" /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <FiClock className="w-3 h-3" /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiList className="w-4 h-4 text-slate-500" />
            Courier Webhook Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of Steadfast webhook callbacks, status updates,
            and payout deductions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Logs
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, status, or CID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Consignment ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">COD Amount</th>
                <th className="py-3 px-4 text-right">Delivery Charge</th>
                <th className="py-3 px-4 text-right text-emerald-700">
                  Net Payout
                </th>
                <th className="py-3 px-4 text-center">Courier Status</th>
                <th className="py-3 px-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    No webhook logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString("en-BD", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 font-mono">
                      {log.invoice || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {log.consignmentId || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {log.order?.customerName ? (
                        <div>
                          <div className="font-medium text-slate-800">
                            {log.order.customerName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {log.order.customerPhone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unlinked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      ৳{log.codAmount?.toLocaleString() ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600">
                      -৳{log.deliveryCharge?.toLocaleString() ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      ৳{log.netPayout?.toLocaleString() ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px]"
                        title="View Raw JSON Payload"
                      >
                        <FiEye className="w-3.5 h-3.5" /> Payload
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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

      {/* Raw Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                Webhook Callback Payload Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Received At:</span>
                <span className="font-mono text-slate-800">
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Invoice Number:</span>
                <span className="font-mono text-slate-800">
                  {selectedLog.invoice}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Consignment ID:</span>
                <span className="font-mono text-slate-800">
                  {selectedLog.consignmentId}
                </span>
              </div>
            </div>

            {/* Formatted JSON Viewer */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Raw JSON Body:
              </label>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(selectedLog.rawPayload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
