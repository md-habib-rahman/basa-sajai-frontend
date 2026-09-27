import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

export default function OrderDistributionChart({ orders = {} }) {
  const data = [
    { name: "Pending", value: orders.pending || 0 },
    { name: "Shipped", value: orders.shipped || 0 },
    { name: "Delivered", value: orders.delivered || 0 },
    { name: "Cancelled", value: orders.cancelled || 0 },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Order Fulfillment Distribution
        </h2>
        <p className="text-xs text-slate-400">Breakdown across order states.</p>
      </div>

      <div className="h-52 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [`${val} orders`, "Total"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-2">
        {data.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: PIE_COLORS[idx] }}
            ></span>
            <span className="text-slate-600 font-medium">{item.name}:</span>
            <span className="font-mono font-bold text-slate-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
