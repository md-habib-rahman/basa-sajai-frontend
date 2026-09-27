import React from "react";
import { FiPlus, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";

export default function SteadfastOrdersHeader({
  balance,
  balanceLoading,
  loading,
  onRefreshBalance,
  onRefreshOrders,
  onCreateOrder,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <FiShoppingCart className="w-4 h-4 text-slate-500" />
          Order Management & Fulfillment
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage customer orders, discounts, Steadfast dispatching, and courier payouts.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        {balance !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-medium font-mono">
            <FiTruck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Steadfast: ৳{balance.toLocaleString()}</span>
            <button onClick={onRefreshBalance} title="Refresh Steadfast Balance" className="hover:rotate-180 transition-transform duration-300 ml-1">
              <FiRefreshCw className={`w-3 h-3 ${balanceLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        )}
        <button onClick={onRefreshOrders} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors">
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
        <button onClick={onCreateOrder} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs">
          <FiPlus className="w-3.5 h-3.5" /> Create New Order
        </button>
      </div>
    </div>
  );
}
