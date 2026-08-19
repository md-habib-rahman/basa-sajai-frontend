import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiRefreshCw,
  FiBox,
  FiUserCheck,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

export default function RoiDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/roi");
      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-md text-slate-400"></span>
      </div>
    );
  }

  const { financials, partnerShares } = metrics || {};
  const isPositiveRoi = (financials?.roiPercentage || 0) >= 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-slate-500" />
            ROI & Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time profitability, return on investment %, and partnership
            profit allocation.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Metrics
        </button>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Capital */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Capital Injected
          </span>
          <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
            ৳{financials?.totalInvestment?.toLocaleString()}
          </span>
        </div>

        {/* Total Revenue */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Gross Sales Revenue
          </span>
          <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
            ৳{financials?.totalRevenue?.toLocaleString()}
          </span>
        </div>

        {/* Net Profit */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Net Profit / (Loss)
          </span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              financials?.netProfit >= 0 ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            ৳{financials?.netProfit?.toLocaleString()}
          </span>
        </div>

        {/* ROI Badge */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Return on Investment
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-extrabold font-mono">
              {financials?.roiPercentage}%
            </span>
            {isPositiveRoi ? (
              <FiArrowUpRight className="w-6 h-6 text-emerald-400" />
            ) : (
              <FiArrowDownRight className="w-6 h-6 text-rose-400" />
            )}
          </div>
        </div>
      </div>

      {/* Partnership Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habib Card */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FiUserCheck className="w-4 h-4 text-slate-600" /> Habib's
              Position
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              50% Partner
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Capital Contributed:</span>
              <span className="font-mono font-semibold text-slate-800">
                ৳{partnerShares?.habib?.contributed?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>50% Net Profit Share:</span>
              <span
                className={`font-mono font-bold ${
                  partnerShares?.habib?.share >= 0
                    ? "text-emerald-700"
                    : "text-rose-600"
                }`}
              >
                ৳{partnerShares?.habib?.share?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Robiul Card */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FiUserCheck className="w-4 h-4 text-slate-600" /> Robiul's
              Position
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              50% Partner
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Capital Contributed:</span>
              <span className="font-mono font-semibold text-slate-800">
                ৳{partnerShares?.robiul?.contributed?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>50% Net Profit Share:</span>
              <span
                className={`font-mono font-bold ${
                  partnerShares?.robiul?.share >= 0
                    ? "text-emerald-700"
                    : "text-rose-600"
                }`}
              >
                ৳{partnerShares?.robiul?.share?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Valuation */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-200 text-slate-700 rounded-xl">
            <FiBox className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Current Unsold Inventory Asset Value
            </h4>
            <p className="text-[11px] text-slate-500">
              Based on total landed unit costs in stock.
            </p>
          </div>
        </div>
        <span className="text-lg font-bold font-mono text-slate-900">
          ৳{financials?.inventoryValuation?.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
