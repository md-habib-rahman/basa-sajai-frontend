import React from "react";
import { FiX, FiPrinter } from "react-icons/fi";

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              BASA SAJAI
            </h2>
            <p className="text-[11px] text-slate-400">
              Invoice #{order.orderNumber}
            </p>
            {order.consignmentId && (
              <p className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                Steadfast CID: {order.consignmentId}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Customer Details */}
        <div className="text-xs space-y-1">
          <div>
            <strong className="text-slate-700">Customer:</strong>{" "}
            {order.customerName}
          </div>
          <div>
            <strong className="text-slate-700">Phone:</strong>{" "}
            {order.customerPhone}
          </div>
          <div>
            <strong className="text-slate-700">Shipping Address:</strong>{" "}
            {order.shippingAddress}
          </div>
          {order.notes && (
            <div className="text-slate-500 italic pt-1">
              <strong className="text-slate-700 not-italic">Notes:</strong>{" "}
              {order.notes}
            </div>
          )}
        </div>

        {/* Item Breakdown with Per-Item Discount */}
        <table className="w-full text-left text-xs border-y border-slate-100">
          <thead>
            <tr className="text-slate-400 uppercase text-[10px]">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="py-2 font-medium text-slate-800">
                  {item.title}
                </td>
                <td className="py-2 text-center text-slate-600">
                  {item.quantity}
                </td>
                <td className="py-2 text-right font-mono text-slate-600">
                  ৳{item.unitPrice}
                </td>
                <td className="py-2 text-right font-mono font-semibold text-slate-800">
                  ৳{item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculations */}
        <div className="text-xs space-y-1 text-right">
          <div className="text-slate-500">
            Delivery Fee: ৳{order.deliveryFee}
          </div>
          {order.discountAmount > 0 && (
            <div className="text-rose-600 font-medium">
              Total Discount: -৳{order.discountAmount}
            </div>
          )}
          <div className="text-sm font-bold text-slate-900 font-mono pt-1">
            Grand Total: ৳{order.totalAmount?.toLocaleString()}
          </div>
          {order.actualReceivedAmount !== null && (
            <div className="text-xs font-bold text-emerald-700 font-mono">
              Actual Courier Payout: ৳
              {order.actualReceivedAmount?.toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-xl"
          >
            <FiPrinter className="w-3.5 h-3.5" /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
