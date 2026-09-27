import React, { useEffect, useState } from "react";
import { fetchItemWiseInventory } from "../../api/reports.api";
import { downloadCsv } from "../../lib/exportCsv";
import Pagination from "../../common/Pagination";
import { FiSearch, FiRefreshCw, FiDownload, FiBox } from "react-icons/fi";

export default function ItemWiseInventoryReport() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchItemWiseInventory({
        page,
        limit,
        search: searchQuery,
      });
      if (res.success) {
        setItems(res.data || []);
        setMeta(res.meta || null);
      }
    } catch (err) {
      console.error("Failed to load item-wise inventory report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, searchQuery]);

  const handleExportCsv = () => {
    if (!items.length) return;
    const rows = items.map((item) => ({
      Title: item.title,
      SKU: item.sku,
      "Total Stock In (pcs)": item.totalStockIn,
      "Total Stock Out (pcs)": item.totalStockOut,
      "Current Stock (pcs)": item.currentStock,
    }));
    downloadCsv(
      rows,
      [
        "Title",
        "SKU",
        "Total Stock In (pcs)",
        "Total Stock Out (pcs)",
        "Current Stock (pcs)",
      ],
      `Item_Wise_Inventory_Report_Page_${page}.csv`,
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU or Title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={!items.length}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <FiDownload className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4 text-center text-emerald-700">
                  Total Stock In
                </th>
                <th className="py-3 px-4 text-center text-rose-700">
                  Total Stock Out
                </th>
                <th className="py-3 px-4 text-center font-bold text-slate-900">
                  Current Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    No items found.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-400">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <FiBox className="w-3.5 h-3.5 text-slate-400" />
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 ml-5">
                        {item.sku}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600">
                      +{item.totalStockIn} pcs
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-rose-600">
                      -{item.totalStockOut} pcs
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 bg-slate-50/80">
                      {item.currentStock} pcs
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
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
