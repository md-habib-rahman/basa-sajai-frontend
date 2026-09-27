import React from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";

export default function DashboardHeader({ onRefresh, isRefetching }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FiActivity className="w-5 h-5 text-emerald-600" />
          Basa Sajai Command Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time operations dashboard, delivery tracking, and treasury
          performance.
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={isRefetching}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto disabled:opacity-50"
      >
        <FiRefreshCw
          className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`}
        />
        Refresh Data
      </button>
    </div>
  );
}
