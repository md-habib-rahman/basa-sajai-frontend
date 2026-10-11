// src/components/orders/CourierTrackingCell.jsx
import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

/**
 * Editable consignment ID.
 * - Saves on blur or Enter, Escape reverts.
 * - Empty value clears the CID.
 * - onSave(value | null) must resolve to true/false; on false the input reverts.
 */
export default function CourierTrackingCell({
  consignmentId,
  syncing,
  onSync,
  onSave,
}) {
  const current = consignmentId ? String(consignmentId) : "";
  const [draft, setDraft] = useState(current);
  const [saving, setSaving] = useState(false);

  // Keep the input in sync when the order changes (send to Steadfast, refetch)
  useEffect(() => {
    setDraft(current);
  }, [current]);

  const commit = async () => {
    const next = draft.trim();
    if (next === current) {
      setDraft(current);
      return;
    }
    setSaving(true);
    const ok = await onSave(next === "" ? null : next);
    setSaving(false);
    if (!ok) setDraft(current);
  };

  const hasCid = current !== "";

  return (
    <div className="inline-flex items-center gap-1">
      <input
        type="text"
        inputMode="numeric"
        placeholder="Not sent / enter CID"
        value={draft}
        disabled={saving}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(current);
            e.currentTarget.blur();
          }
        }}
        className={`w-32 text-center rounded-lg px-2 py-0.5 text-[10px] font-mono border focus:bg-white focus:ring-2 ${
          hasCid
            ? "bg-emerald-50 text-emerald-800 border-emerald-200/80 focus:ring-emerald-300"
            : "bg-slate-50 text-slate-600 border-slate-200 italic focus:ring-slate-300"
        } ${saving ? "opacity-60" : ""}`}
      />
      {hasCid && (
        <button
          onClick={onSync}
          disabled={syncing}
          className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
          title="Sync status from Steadfast"
        >
          <FiRefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
        </button>
      )}
    </div>
  );
}
