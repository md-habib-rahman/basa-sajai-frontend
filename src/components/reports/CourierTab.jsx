import React, { useEffect, useState } from "react";
import { fetchCourierReport } from "../../api/reports.api";
import DateRangeFilter from "./DateRangeFilter";
import { downloadCsv } from "../../lib/exportCsv";
import {
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiAlertTriangle,
} from "react-icons/fi";

export default function CourierTab() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchCourierReport({ startDate, endDate });
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load courier report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const handleExportCsv = () => {
    if (!data) return;

    const rows = [
      { Metric: "Total Orders Processed", Value: data.totalOrders || 0 },
      { Metric: "Pending Orders", Value: data.statusBreakdown?.pending || 0 },
      {
        Metric: "Processing Orders",
        Value: data.statusBreakdown?.processing || 0,
      },
      { Metric: "Shipped Orders", Value: data.statusBreakdown?.shipped || 0 },
      {
        Metric: "Delivered Orders",
        Value: data.statusBreakdown?.delivered || 0,
      },
      {
        Metric: "Cancelled/Returned Orders",
        Value: data.statusBreakdown?.cancelled || 0,
      },
      {
        Metric: "Delivery Success Rate (%)",
        Value: `${data.performance?.deliverySuccessRate || 0}%`,
      },
      {
        Metric: "Return Rate (%)",
        Value: `${data.performance?.returnRate || 0}%`,
      },
      {
        Metric: "Delivered Order Revenue (৳)",
        Value: data.performance?.deliveredRevenue || 0,
      },
      {
        Metric: "Lost Delivery Fees (৳)",
        Value: data.performance?.lostDeliveryFeeImpact || 0,
      },
      {
        Metric: "Returned Inventory Value (৳)",
        Value: data.performance?.returnedProductValue || 0,
      },
      {
        Metric: "Total Financial Impact of Returns (৳)",
        Value: data.performance?.totalReturnLossImpact || 0,
      },
    ];

    const fileName = `Courier_Fulfillment_Report_${startDate || "All"}_to_${endDate || "Present"}.csv`;
    downloadCsv(rows, ["Metric", "Value"], fileName);
  };

  return (
    <div className="space-y-6">
      {/* Date Range Filter Bar */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        loading={loading}
        onExportCsv={handleExportCsv}
        exportLabel="Export Courier CSV"
      />

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <span className="loading loading-spinner loading-md"></span>
          <p className="text-xs mt-2">
            Calculating courier fulfillment metrics...
          </p>
        </div>
      ) : (
        <>
          {/* Top Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Success Rate */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Delivery Success Rate
                </span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-600 font-mono">
                {data?.performance?.deliverySuccessRate || 0}%
              </p>
              <span className="text-[11px] text-slate-400 mt-2 block">
                {data?.statusBreakdown?.delivered || 0} Delivered Orders
              </span>
            </div>

            {/* Return Rate */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Return / Cancel Rate
                </span>
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <FiXCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-rose-600 font-mono">
                {data?.performance?.returnRate || 0}%
              </p>
              <span className="text-[11px] text-slate-400 mt-2 block">
                {data?.statusBreakdown?.cancelled || 0} Returned / Cancelled
              </span>
            </div>

            {/* Lost Delivery Fees */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Lost Delivery Fees
                </span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <FiTruck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-700 font-mono">
                ৳
                {data?.performance?.lostDeliveryFeeImpact?.toLocaleString() ||
                  0}
              </p>
              <span className="text-[11px] text-slate-400 mt-2 block">
                Unrecovered shipping fees
              </span>
            </div>

            {/* Total Return Impact */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Total Return Loss Impact
                </span>
                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                  <FiAlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-rose-400 font-mono">
                ৳
                {data?.performance?.totalReturnLossImpact?.toLocaleString() ||
                  0}
              </p>
              <span className="text-[11px] text-slate-400 mt-2 block">
                Shipping losses + tied-up inventory
              </span>
            </div>
          </div>

          {/* Fulfillment Pipeline Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FiTruck className="w-4 h-4 text-slate-500" />
              Order Status Pipeline Breakdown
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  Pending
                </span>
                <p className="text-base font-bold text-slate-800 font-mono mt-1">
                  {data?.statusBreakdown?.pending || 0}
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-center">
                <span className="text-[10px] font-semibold text-blue-600 uppercase">
                  Processing
                </span>
                <p className="text-base font-bold text-blue-900 font-mono mt-1">
                  {data?.statusBreakdown?.processing || 0}
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-xl text-center">
                <span className="text-[10px] font-semibold text-indigo-600 uppercase">
                  Shipped
                </span>
                <p className="text-base font-bold text-indigo-900 font-mono mt-1">
                  {data?.statusBreakdown?.shipped || 0}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-center">
                <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                  Delivered
                </span>
                <p className="text-base font-bold text-emerald-900 font-mono mt-1">
                  {data?.statusBreakdown?.delivered || 0}
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-xl text-center">
                <span className="text-[10px] font-semibold text-rose-600 uppercase">
                  Cancelled
                </span>
                <p className="text-base font-bold text-rose-900 font-mono mt-1">
                  {data?.statusBreakdown?.cancelled || 0}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
