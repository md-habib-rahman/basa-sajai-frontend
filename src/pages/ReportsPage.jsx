import React, { useState } from "react";
import ItemWiseInventoryReport from "../components/reports/ItemWiseInventoryReport";
import DateWiseInventoryReport from "../components/reports/DateWiseInventoryReport";
import CustomerWiseOrderReport from "../components/reports/CustomerWiseOrderReport";
import { FiPieChart, FiBox, FiCalendar, FiUser } from "react-icons/fi";

export default function ReportsPage() {
  // Tabs: "inventory-item" | "inventory-date" | "customer-orders"
  const [activeTab, setActiveTab] = useState("inventory-item");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiPieChart className="w-5 h-5 text-slate-600" />
            Inventory & Order Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed item stock flows, date-wise inventory movements, and
            customer order histories.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium gap-0.5">
          <button
            onClick={() => setActiveTab("inventory-item")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "inventory-item"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiBox className="w-3.5 h-3.5" />
            Item-wise Inventory
          </button>

          <button
            onClick={() => setActiveTab("inventory-date")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "inventory-date"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiCalendar className="w-3.5 h-3.5" />
            Date-wise Inventory
          </button>

          <button
            onClick={() => setActiveTab("customer-orders")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "customer-orders"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiUser className="w-3.5 h-3.5" />
            Customer Orders
          </button>
        </div>
      </div>

      {/* Render Active Report Component */}
      {activeTab === "inventory-item" && <ItemWiseInventoryReport />}
      {activeTab === "inventory-date" && <DateWiseInventoryReport />}
      {activeTab === "customer-orders" && <CustomerWiseOrderReport />}
    </div>
  );
}
