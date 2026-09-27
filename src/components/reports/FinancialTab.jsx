import React, { useEffect, useState } from "react";
import { fetchFinancialSummary } from "../../api/reports.api";
import { downloadCsv } from "../../lib/exportCsv";
import DateRangeFilter from "./DateRangeFilter";
import { FiDollarSign, FiTag, FiTrendingUp } from "react-icons/fi";

export default function FinancialTab() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchFinancialSummary({ startDate, endDate });
      if (res.success) setData(res.data);
    } catch (err) {
      console.error(err);
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
      { Metric: "Total Orders Count", Value: data.totalOrdersCount },
      { Metric: "Gross Product Sales (৳)", Value: data.totalGrossRevenue },
      {
        Metric: "Delivery Fees Collected (৳)",
        Value: data.totalDeliveryFeesCollected,
      },
      { Metric: "Discounts Allowed (৳)", Value: data.totalDiscountsGiven },
      { Metric: "Net Revenue (৳)", Value: data.netRevenue },
      { Metric: "Product Base Cost (৳)", Value: data.totalProductBaseCost },
      { Metric: "Marketing Cost Burden (৳)", Value: data.totalMarketingCost },
      { Metric: "Packaging Cost Burden (৳)", Value: data.totalPackagingCost },
      { Metric: "Total COGS & Operating Costs (৳)", Value: data.totalCOGS },
      {
        Metric: "Net Operating Profit Margin (৳)",
        Value: data.netProfitMargin,
      },
    ];
    downloadCsv(
      rows,
      ["Metric", "Value"],
      `Financial_Statement_${startDate || "All"}_to_${endDate || "Present"}.csv`,
    );
  };

  return (
    <div className="space-y-6">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        loading={loading}
        onExportCsv={handleExportCsv}
        exportLabel="Export Financial CSV"
      />

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Net Revenue
                </span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FiDollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">
                ৳{data?.netRevenue?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Total COGS
                </span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <FiTag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono">
                ৳{data?.totalCOGS?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 uppercase">
                  Net Profit Margin
                </span>
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                ৳{data?.netProfitMargin?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
