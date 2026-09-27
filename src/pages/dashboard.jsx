import React from "react";
import { useDashboardSummary } from "../hook/useDashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KpiCards from "../components/dashboard/KpiCards";
import OrderTrendChart from "../components/dashboard/OrderTrendChart";
import InvestmentChart from "../components/dashboard/InvestmentChart";
import OrderDistributionChart from "../components/dashboard/OrderDistributionChart";
import LowStockWidget from "../components/dashboard/LowStockWidget";

export default function Dashboard() {
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="loading loading-spinner loading-md"></span>
          <p className="text-xs font-medium">
            Loading command center analytics...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">
        Failed to load dashboard data.
      </div>
    );
  }

  console.log(summary.inventory?.lowStockItems);

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader onRefresh={refetch} isRefetching={isRefetching} />
      <KpiCards data={summary} />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <OrderTrendChart data={summary?.orders?.dateWiseTrend} />
        <InvestmentChart investments={summary?.financials} />
        <OrderDistributionChart orders={summary?.orders} />
      </div>

      {/* Distribution & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* <OrderDistributionChart orders={summary?.orders} /> */}
        <LowStockWidget items={summary?.inventory?.lowStockItems} />
      </div>
    </div>
  );
}
