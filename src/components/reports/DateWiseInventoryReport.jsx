import React, { useEffect, useState } from "react";
import { fetchDateWiseInventory } from "../../api/reports.api";
import { downloadCsv } from "../../lib/exportCsv";
import DateRangeFilter from "./DateRangeFilter";
import { FiCalendar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function DateWiseInventoryReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchDateWiseInventory({ startDate, endDate });
      if (res.success) {
        setRecords(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load date-wise inventory report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const handleExportCsv = () => {
    if (!records.length) return;
    const rows = records.map((r) => ({
      Date: r.date,
      "Stock In (pcs)": r.stockIn,
      "Stock Out (pcs)": r.stockOut,
      "Net Movement (pcs)": r.netChange,
      "Total Audit Logs": r.totalLogCount,
    }));
    downloadCsv(
      rows,
      ["Date", "Stock In (pcs)", "Stock Out (pcs)", "Net Movement (pcs)", "Total Audit Logs"],
      `Date_Wise_Inventory_Report_${startDate || "All"}_to_${endDate || "Present"}.csv`
    );
  };

  return (
    <div className="space-y-4">
      {/* Date Filter Bar */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        loading={loading}
        onExportCsv={handleExportCsv}
        exportLabel="Export Date-Wise CSV"
      />

      {/* Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center text-emerald-700">Stock In (+)</th>
                <th className="py-3 px-4 text-center text-rose-700">Stock Out (-)</th>
                <th className="py-3 px-4 text-center">Net Movement</th>
                <th className="py-3 px-4 text-center text-slate-400">Total Activity Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    No inventory movement records found for the selected date range.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.date} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-800 font-semibold flex items-center gap-2">
                      <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                      {record.date}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600">
                      +{record.stockIn} pcs
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-rose-600">
                      -{record.stockOut} pcs
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
                          record.netChange > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : record.netChange < 0
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {record.netChange > 0 ? (
                          <FiTrendingUp className="w-3 h-3" />
                        ) : record.netChange < 0 ? (
                          <FiTrendingDown className="w-3 h-3" />
                        ) : null}
                        {record.netChange > 0 ? `+${record.netChange}` : record.netChange} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono">
                      {record.totalLogCount} logs
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}