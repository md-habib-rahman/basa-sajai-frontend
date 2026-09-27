import React from 'react';
import {
  FiTrendingUp,
  FiPieChart,
  FiDollarSign,
  FiAlertTriangle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCheckCircle,
} from 'react-icons/fi';

export default function KpiCards({ data }) {
  const grossSales = data?.financials?.totalGrossSales || 0;
  const capitalInvested = data?.financials?.totalInvestmentsAmount || 0;
  const bankBalance = data?.financials?.currentBankBalance || 0;
  const totalOutflow = data?.financials?.totalBankOutflow || 0;
  const lowStockCount = data?.inventory?.lowStockCount || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Gross Sales */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Gross Sales Value</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiTrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-slate-900">
            ৳{grossSales.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-1">
            <FiArrowUpRight className="w-3 h-3" /> Active & shipped invoices
          </p>
        </div>
      </div>

      {/* 2. Capital Raised */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Capital Investments</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <FiPieChart className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-slate-900">
            ৳{capitalInvested.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Partner equity raised</p>
        </div>
      </div>

      {/* 3. Bank Treasury Balance */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Bank Treasury Balance</span>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <FiDollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-slate-900">
            ৳{bankBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-purple-600 flex items-center gap-0.5 mt-1">
            <FiCheckCircle className="w-3 h-3" /> Liquid available capital
          </p>
        </div>
      </div>

      {/* 4. Total Debited / Withdrawal Amount */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Debited / Outflow</span>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <FiArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-rose-600">
            ৳{totalOutflow.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total bank withdrawals & debits</p>
        </div>
      </div>

      {/* 5. Low Stock Warning */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Low Stock Warnings</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <FiAlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-amber-600">
            {lowStockCount} Items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Stock quantity $\le$ 5 units</p>
        </div>
      </div>
    </div>
  );
}