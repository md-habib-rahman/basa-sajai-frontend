import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import Pagination from "../common/Pagination";
import { FiArchive, FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function InventoryLogs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
//   const [limit, setLimit] = useState(15);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-logs", page, search],
    queryFn: async () => {
      const res = await api.get(
        `/products/inventory-logs?page=${page}&limit=15&search=${search}`,
      );

      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FiArchive className="w-5 h-5 text-indigo-600" /> Stock Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete movement history of stock adjustments, order deductions,
            and cancellations.
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search product title, SKU, or Order #"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4 text-center">Change</th>
              <th className="py-3 px-4">Note / Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  Loading audit trail...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-400">
                  No inventory logs found.
                </td>
              </tr>
            ) : (
              data?.data?.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {log.product?.title}{" "}
                    <span className="text-slate-400 font-mono text-[10px]">
                      ({log.product?.sku})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {log.changeType}
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs ${
                        log.quantityChange > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {log.quantityChange > 0 ? <FiArrowUp /> : <FiArrowDown />}
                      {log.quantityChange > 0
                        ? `+${log.quantityChange}`
                        : log.quantityChange}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {log.note || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data?.meta && (
          <div className="p-4">
            <Pagination meta={data?.meta} onPageChange={(p) => setPage(p)} />
          </div>
        )}
      </div>
    </div>
  );
}
