import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SteadfastOrderFilters({ searchQuery, statusFilter, onSearchChange, onStatusChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="relative w-full sm:w-72">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input type="text" placeholder="Search order #, customer, or phone..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300" />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs text-slate-400 font-medium">Status:</span>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none">
          <option value="ALL">All Order States</option><option value="PENDING">Pending</option><option value="PROCESSING">Processing</option><option value="SHIPPED">Shipped</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
