// src/components/orders/OrderRowActions.jsx
import React from "react";
import { FiPrinter, FiTrash2, FiEye, FiEdit3, FiTruck } from "react-icons/fi";

const baseBtn = "p-1.5 rounded-lg transition-colors";

export default function OrderRowActions({
  canDispatch,
  dispatching,
  onDispatch,
  onEdit,
  onView,
  onPrint,
  onDelete,
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {canDispatch && (
        <button
          onClick={onDispatch}
          disabled={dispatching}
          className={`${baseBtn} text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-1`}
          title="Send to Steadfast Courier"
        >
          <FiTruck
            className={`w-3.5 h-3.5 ${dispatching ? "animate-bounce" : ""}`}
          />
        </button>
      )}
      <button
        onClick={onEdit}
        className={`${baseBtn} text-slate-500 hover:text-slate-900 hover:bg-slate-100`}
        title="Edit"
      >
        <FiEdit3 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onView}
        className={`${baseBtn} text-slate-500 hover:text-slate-900 hover:bg-slate-100`}
        title="View invoice"
      >
        <FiEye className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onPrint}
        className={`${baseBtn} text-slate-700 hover:text-slate-900 hover:bg-slate-100`}
        title="Print"
      >
        <FiPrinter className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onDelete}
        className={`${baseBtn} text-slate-400 hover:text-rose-600 hover:bg-rose-50`}
        title="Delete"
      >
        <FiTrash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
