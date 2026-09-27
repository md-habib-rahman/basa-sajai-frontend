import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function InvestmentChart({ investments = {} }) {
  const {
    totalHabibContribution = 0,
    totalRobiulContribution = 0,
    investmentsList = [],
  } = investments;

//   console.log( {investments} );

  // Chart Data: Partner Contribution Comparison
  const partnerContributionData = [
    { partner: "Habib", Contribution: totalHabibContribution },
    { partner: "Robiul", Contribution: totalRobiulContribution },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Partner Equity Contributions
          </h2>
          <p className="text-xs text-slate-400">
            Total capital invested by Habib vs. Robiul.
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        {investmentsList.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No investment records found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={partnerContributionData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="partner"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [
                  `৳${Number(value).toLocaleString()}`,
                  "Total Invested",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="Contribution"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                barSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
