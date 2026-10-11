// src/components/orders/ActualReceivedInput.jsx
import React from "react";

export default function ActualReceivedInput({ value, onCommit }) {
  return (
    <input
      // remount when the saved value changes so defaultValue never goes stale
      key={value ?? ""}
      type="number"
      placeholder="Courier payout"
      defaultValue={value ?? ""}
      onBlur={(e) => onCommit(e.target.value)}
      className="w-24 text-right bg-emerald-50/60 border border-emerald-200/80 rounded-lg px-2 py-1 text-xs font-mono font-bold text-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-300"
    />
  );
}
