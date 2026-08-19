import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ meta, onPageChange, onLimitChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { currentPage, totalPages, totalItems, itemsPerPage } = meta;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
      {/* Items Count Summary */}
      <div>
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-slate-800">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
        items
      </div>

      <div className="flex items-center gap-4">
        {/* Rows Per Page Selector */}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 text-xs font-medium focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!meta.hasPrevPage}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition-colors"
            title="Previous Page"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-slate-100 rounded-lg font-medium text-slate-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!meta.hasNextPage}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition-colors"
            title="Next Page"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
