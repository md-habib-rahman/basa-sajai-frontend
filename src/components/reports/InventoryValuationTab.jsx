import React, { useState } from "react";
import { FiPieChart } from "react-icons/fi";
import FinancialTab from "./FinancialTab";
import CourierTab from "./CourierTab";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("financial");

  return (
    <div className="space-y-8">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiPieChart className="w-5 h-5 text-slate-600" />
            Operational Intelligence & Reporting
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial performance, inventory valuation, and
            fulfillment analytics.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab("financial")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "financial"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Financial & Margin Statement
          </button>
          <button
            onClick={() => setActiveTab("valuation")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "valuation"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Stock Asset Valuation
          </button>
          <button
            onClick={() => setActiveTab("courier")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "courier"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Courier & Fulfillment
          </button>
        </div>
      </div>

      {/* Render Active Module */}
      {/* {activeTab === "financial" && <FinancialTab />} */}
      {/* {activeTab === "valuation" && <InventoryValuationTab />} */}
      {/* {activeTab === "courier" && <CourierTab />} */}
    </div>
  );
}
