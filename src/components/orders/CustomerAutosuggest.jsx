import React, { useState, useEffect, useRef } from "react";
import { fetchCustomerSuggestions } from "../../api/orders.api";
import { FiUser, FiPhone, FiMapPin } from "react-icons/fi";


export default function CustomerAutosuggest({
  formData,
  setFormData,
  onSelectCustomer,
}) {
  const [query, setQuery] = useState(formData.customerName || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);


  // Sync internal search state when parent form changes externally
  useEffect(() => {
    setQuery(formData.customerName || "");
  }, [formData.customerName]);

  // Fetch suggestions with a short debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2 && isOpen) {
        setLoading(true);
        try {
          const results = await fetchCustomerSuggestions(query);
          setSuggestions(results);
        } catch (err) {
          console.error("Failed to fetch customer suggestions:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setFormData((prev) => ({ ...prev, customerName: val }));
    setIsOpen(true);
  };

  const handleSelectSuggestion = (customer) => {
    // Auto-fill all customer details in parent form state
    setFormData((prev) => ({
      ...prev,
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      shippingAddress: customer.shippingAddress,
    }));
    setQuery(customer.customerName);
    setIsOpen(false);

    if (onSelectCustomer) onSelectCustomer(customer);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Customer Name *
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Type customer name or phone..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        {loading && (
          <span className="loading loading-spinner loading-xs absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></span>
        )}
      </div>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
          {suggestions.map((cust, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(cust)}
              className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex flex-col gap-1"
            >
              <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <FiUser className="w-3.5 h-3.5 text-slate-400" />
                {cust.customerName}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <FiPhone className="w-3 h-3 text-slate-400" />
                {cust.customerPhone}
              </div>
              {cust.shippingAddress && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate">
                  <FiMapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{cust.shippingAddress}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
