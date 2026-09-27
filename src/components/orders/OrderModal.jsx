import React, { useState, useEffect } from "react";
import { FiX, FiPlus } from "react-icons/fi";

export default function OrderModal({
  isOpen,
  onClose,
  editingOrderId,
  formData,
  setFormData,
  products,
  onSubmit,
  submitting,
}) {
  const [deliveryZone, setDeliveryZone] = useState("INSIDE_DHAKA");

  useEffect(() => {
    const fee = formData.deliveryFee ?? 80;
    if (fee === 80) setDeliveryZone("INSIDE_DHAKA");
    else if (fee === 150) setDeliveryZone("OUTSIDE_DHAKA");
    else setDeliveryZone("CUSTOM");
  }, [formData.deliveryFee]);

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", quantity: 1, unitPrice: "", itemDiscount: 0 },
      ],
    }));
  };

  const handleRemoveItemRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];

    if (field === "productId") {
      updated[index].productId = value;
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        updated[index].unitPrice =
          selectedProduct.actualSellingPrice || selectedProduct.sellingPrice;
      }
    } else if (field === "quantity") {
      updated[index].quantity = Number(value);
    } else if (field === "unitPrice") {
      updated[index].unitPrice = value === "" ? "" : Number(value);
    } else if (field === "itemDiscount") {
      updated[index].itemDiscount = value === "" ? 0 : Number(value);
    }

    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const handleDeliveryZoneChange = (zone) => {
    setDeliveryZone(zone);
    if (zone === "INSIDE_DHAKA") {
      setFormData((prev) => ({ ...prev, deliveryFee: 80 }));
    } else if (zone === "OUTSIDE_DHAKA") {
      setFormData((prev) => ({ ...prev, deliveryFee: 150 }));
    }
  };

  const itemsGrossTotal = formData.items.reduce((acc, row) => {
    const prd = products.find((p) => p.id === row.productId);
    const effectivePrice =
      row.unitPrice !== ""
        ? Number(row.unitPrice)
        : prd
          ? prd.actualSellingPrice || prd.sellingPrice
          : 0;
    return acc + effectivePrice * Number(row.quantity || 0);
  }, 0);

  const totalItemDiscounts = formData.items.reduce(
    (sum, row) => sum + Number(row.itemDiscount || 0),
    0,
  );

  const grandTotalDiscount =
    totalItemDiscounts + Number(formData.otherDiscount || 0);

  const calculatedGrandTotal = Math.max(
    0,
    itemsGrossTotal - grandTotalDiscount + Number(formData.deliveryFee || 0),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            {editingOrderId ? "Edit Order Details" : "Create Customer Order"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Customer Phone *
              </label>
              <input
                type="text"
                required
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Shipping Address *
            </label>
            <textarea
              required
              rows="2"
              value={formData.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddress: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
            />
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-slate-700">
                Order Items
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-[11px] font-medium text-slate-700 hover:underline flex items-center gap-1"
              >
                <FiPlus className="w-3 h-3" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase px-1">
              <div className="col-span-4">Order Items</div>
              <div className="col-span-2 text-right">Unit Cost</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Discount</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            {formData.items.map((row, idx) => {
              const prd = products.find((p) => p.id === row.productId);
              const effectiveUnitCost =
                row.unitPrice !== ""
                  ? Number(row.unitPrice)
                  : prd
                    ? prd.actualSellingPrice || prd.sellingPrice
                    : 0;

              const lineCalculatedPrice = Math.max(
                0,
                effectiveUnitCost * Number(row.quantity || 1) -
                  Number(row.itemDiscount || 0),
              );

              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50/80 p-1.5 rounded-xl border border-slate-200/60"
                >
                  <div className="col-span-4">
                    <select
                      required
                      value={row.productId}
                      onChange={(e) =>
                        handleItemChange(idx, "productId", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="">Select Inventory Product...</option>
                      {products.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={
                            p.stockQuantity <= 0 && row.productId !== p.id
                          }
                        >
                          {p.title} (Stock: {p.stockQuantity}) — ৳
                          {p.actualSellingPrice || p.sellingPrice}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Cost"
                      value={row.unitPrice}
                      onChange={(e) =>
                        handleItemChange(idx, "unitPrice", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-right font-mono font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      required
                      value={row.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-center font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={row.itemDiscount}
                      onChange={(e) =>
                        handleItemChange(idx, "itemDiscount", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-right font-mono text-rose-600 font-medium"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <span className="font-mono font-bold text-xs text-slate-800">
                      ৳{lineCalculatedPrice.toLocaleString()}
                    </span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-md"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Zone, Delivery Charge, and Other Discount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Delivery Zone *
              </label>
              <select
                value={deliveryZone}
                onChange={(e) => handleDeliveryZoneChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium"
              >
                <option value="INSIDE_DHAKA">Inside Dhaka (৳80)</option>
                <option value="OUTSIDE_DHAKA">Outside Dhaka (৳150)</option>
                <option value="CUSTOM">Custom Delivery Charge</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Delivery Charge (৳)
              </label>
              <input
                type="number"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    deliveryFee: Number(e.target.value),
                  });
                  setDeliveryZone("CUSTOM");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Other Discount (৳)
              </label>
              <input
                type="number"
                min="0"
                value={formData.otherDiscount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    otherDiscount: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-rose-600 font-semibold"
              />
            </div>
          </div>

          {/* Order Notes Field */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Order Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Add special instructions, courier preferences, or internal notes..."
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
            />
          </div>

          {/* Real-time Summary Card */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Gross Items Subtotal:</span>
              <span className="font-mono text-slate-800">
                ৳{itemsGrossTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-rose-600 font-medium pt-0.5">
              <span>Total Discount (Items + Other):</span>
              <span className="font-mono font-bold">
                -৳{grandTotalDiscount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Delivery Charge:</span>
              <span className="font-mono text-slate-800">
                +৳{formData.deliveryFee}
              </span>
            </div>

            <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200/60 pt-1 mt-1">
              <span>Grand Total:</span>
              <span className="font-mono text-emerald-700">
                ৳{calculatedGrandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-xl"
            >
              {submitting
                ? editingOrderId
                  ? "Updating..."
                  : "Creating..."
                : editingOrderId
                  ? "Update Order"
                  : "Confirm Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
