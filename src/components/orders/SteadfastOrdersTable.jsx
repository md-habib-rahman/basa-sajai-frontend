// src/components/orders/SteadfastOrdersTable.jsx
import React from "react";
import Pagination from "../../common/Pagination";
import SteadfastOrderRow from "./SteadfastOrderRow";

const COLUMNS = [
  { label: "#" },
  { label: "Order #" },
  { label: "Customer" },
  { label: "Phone" },
  { label: "Courier Tracking", className: "text-center" },
  { label: "Total Amount", className: "text-right" },
  { label: "Status" },
  { label: "Actual Received", className: "text-right text-emerald-800" },
  { label: "Actions", className: "text-right" },
];

function EmptyRow({ children }) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="text-center py-12 text-slate-400">
        {children}
      </td>
    </tr>
  );
}

export default function SteadfastOrdersTable({
  orders,
  loading,
  meta,
  page,
  limit,
  syncingId,
  dispatchingId,
  onPageChange,
  onLimitChange,
  rowHandlers,
}) {
  return (
    <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`py-3 px-4 ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <EmptyRow>
                <span className="loading loading-spinner loading-sm"></span>
              </EmptyRow>
            ) : orders.length === 0 ? (
              <EmptyRow>No orders found.</EmptyRow>
            ) : (
              orders.map((order, index) => (
                <SteadfastOrderRow
                  key={order.id}
                  order={order}
                  serial={(page - 1) * limit + index + 1}
                  syncing={syncingId === order.id}
                  dispatching={dispatchingId === order.id}
                  {...rowHandlers}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 pb-4">
        <Pagination
          meta={meta}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  );
}
