import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const InventoryLogsDrawer = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventory-logs", page, search],
    queryFn: async () => {
      const res = await api.get(
        `/products/inventory-logs?page=${page}&limit=10&search=${search}`,
      );
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const logs = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  const getBadgeColor = (type) => {
    switch (type) {
      case "RESTOCK":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "ORDER_CREATED":
      case "ORDER_EDIT":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ORDER_CANCELLED":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "MANUAL_ADJUSTMENT":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between rounded-t-lg">
        <div>
          <h2 className="text-lg font-bold">📦 Inventory Audit Trail</h2>
          <p className="text-xs text-slate-400">
            Detailed movement logs for stock adjustments and order deductions
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <input
          type="text"
          placeholder="Search logs by note, title, or SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Log Table Body */}
      <div className="p-6 space-y-3">
        {isLoading ? (
          <div className="text-center py-10 text-slate-500">
            Loading audit logs...
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-rose-500">
            Failed to load audit logs.
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p className="font-semibold text-slate-700">
              No inventory logs found.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Logs are generated automatically when products are created, orders
              are submitted, or stock is adjusted.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-slate-900 text-sm">
                  {log.product?.title || "Unknown Item"}
                  <span className="ml-2 text-xs text-slate-500 font-mono">
                    [{log.product?.sku || "N/A"}]
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getBadgeColor(
                    log.changeType,
                  )}`}
                >
                  {log.changeType}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-2">{log.note}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                <span>
                  Delta:{" "}
                  <strong
                    className={
                      log.quantityChange > 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }
                  >
                    {log.quantityChange > 0
                      ? `+${log.quantityChange}`
                      : log.quantityChange}
                  </strong>
                </span>
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 rounded-b-lg">
        <span>
          Page {meta.page} of {meta.totalPages} ({meta.total} records)
        </span>
        <div className="flex space-x-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-slate-100"
          >
            Previous
          </button>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
