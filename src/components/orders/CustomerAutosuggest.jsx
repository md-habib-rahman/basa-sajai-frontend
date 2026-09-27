import React, { useEffect, useState } from "react";
import { fetchCustomerSuggestions } from "../../api/orders.api";

export default function CustomerAutosuggest({ formData, setFormData }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }

    let active = true;
    const timer = setTimeout(async () => {
      try {
        const results = await fetchCustomerSuggestions(query.trim());
        if (active) setSuggestions(results);
      } catch (error) {
        if (active) setSuggestions([]);
        console.warn("Could not load customer suggestions:", error.message);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setQuery(value);
    setOpen(true);
  };

  const selectCustomer = (customer) => {
    setFormData((current) => ({
      ...current,
      customerName: customer.customerName || "",
      customerPhone: customer.customerPhone || "",
      shippingAddress: customer.shippingAddress || "",
    }));
    setSuggestions([]);
    setQuery("");
    setOpen(false);
  };

  return (
    <div
      className="col-span-2 relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Customer Name *</label>
          <input type="text" required value={formData.customerName} onFocus={() => setOpen(true)} onChange={(e) => updateField("customerName", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800" />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Customer Phone *</label>
          <input type="text" required value={formData.customerPhone} onFocus={() => setOpen(true)} onChange={(e) => updateField("customerPhone", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800" />
        </div>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((customer, index) => (
            <li key={`${customer.customerPhone || customer.customerName}-${index}`}>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectCustomer(customer)} className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b last:border-b-0 border-slate-100">
                <span className="block text-xs font-medium text-slate-800">{customer.customerName}</span>
                <span className="block text-[11px] text-slate-500">{customer.customerPhone} · {customer.shippingAddress}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
