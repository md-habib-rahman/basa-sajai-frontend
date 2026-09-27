import React from "react";
import { FiCalendar, FiRefreshCw, FiDownload } from "react-icons/fi";

export default function DateRangeFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onRefresh,
  loading,
  onExportCsv,
  exportLabel = "Export CSV",
}) {
  const handleQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <FiCalendar className="w-4 h-4 text-slate-400" />
          Date Range:
        </span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <span className="text-slate-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="text-rose-600 hover:underline font-medium text-xs ml-2"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => handleQuickFilter(7)}
          className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
        >
          7 Days
        </button>
        <button
          onClick={() => handleQuickFilter(30)}
          className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
        >
          30 Days
        </button>

        {onExportCsv && (
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1 border border-slate-200 rounded-lg font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors ml-1"
          >
            <FiDownload className="w-3.5 h-3.5" />
            {exportLabel}
          </button>
        )}

        <button
          onClick={onRefresh}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 ml-1"
          title="Refresh Report"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
