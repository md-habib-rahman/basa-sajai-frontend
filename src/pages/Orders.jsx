import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Pagination from "../common/Pagination";
import {
  FiShoppingCart,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiPrinter,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiEye,
} from "react-icons/fi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    deliveryFee: 120,
    discountAmount: 0,
    notes: "",
    items: [{ productId: "", quantity: 1, unitPrice: "" }],
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/orders?page=${page}&limit=${limit}&search=${searchQuery}&status=${statusFilter}`,
      );
      if (res.data.success) {
        setOrders(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsList = async () => {
    try {
      const res = await api.get("/products?limit=100");
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleAddItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: "" }],
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
      // Auto-populate with actual selling price (or calculated selling price)
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        updated[index].unitPrice =
          selectedProduct.actualSellingPrice || selectedProduct.sellingPrice;
      }
    } else if (field === "quantity") {
      updated[index].quantity = Number(value);
    } else if (field === "unitPrice") {
      updated[index].unitPrice = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post("/orders", formData);
      if (res.data.success) {
        setIsCreateModalOpen(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          shippingAddress: "",
          deliveryFee: 120,
          discountAmount: 0,
          notes: "",
          items: [{ productId: "", quantity: 1, unitPrice: "" }],
        });
        fetchOrders();
      }
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Failed to create order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  const handleDirectPrint = (order) => {
    setInvoiceOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Dynamic preview total calculation
  const itemsSubtotal = formData.items.reduce((acc, row) => {
    const prd = products.find((p) => p.id === row.productId);
    const effectivePrice =
      row.unitPrice !== ""
        ? Number(row.unitPrice)
        : prd
          ? prd.actualSellingPrice || prd.sellingPrice
          : 0;
    return acc + effectivePrice * Number(row.quantity || 0);
  }, 0);

  const calculatedGrandTotal = Math.max(
    0,
    itemsSubtotal +
      Number(formData.deliveryFee || 0) -
      Number(formData.discountAmount || 0),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiShoppingCart className="w-4 h-4 text-slate-500" />
            Order Management & Invoicing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer orders, discounts, and custom item price overrides.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Create New Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer, or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Order States</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Discount</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {order.customerPhone}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-600">
                      {order.items?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600 font-medium">
                      {order.discountAmount > 0
                        ? `-৳${order.discountAmount}`
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                      ৳{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg px-2 py-0.5"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        title="View Invoice Modal"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDirectPrint(order)}
                        className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        title="Print Invoice Directly"
                      >
                        <FiPrinter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Order"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-4">
          <Pagination
            meta={meta}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                Create Customer Order
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
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
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
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
                    setFormData({
                      ...formData,
                      shippingAddress: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              {/* Order Items Section */}
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

                {formData.items.map((row, idx) => {
                  const currentProduct = products.find(
                    (p) => p.id === row.productId,
                  );
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      {/* Dropdown showing actual selling price */}
                      <select
                        required
                        value={row.productId}
                        onChange={(e) =>
                          handleItemChange(idx, "productId", e.target.value)
                        }
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        <option value="">Select Inventory Product...</option>
                        {products.map((p) => {
                          const priceToDisplay =
                            p.actualSellingPrice || p.sellingPrice;
                          return (
                            <option
                              key={p.id}
                              value={p.id}
                              disabled={p.stockQuantity <= 0}
                            >
                              {p.title} (Stock: {p.stockQuantity}) — ৳
                              {priceToDisplay}
                            </option>
                          );
                        })}
                      </select>

                      {/* Manual Price Override */}
                      <div className="relative w-24">
                        <input
                          type="number"
                          placeholder="Price"
                          value={row.unitPrice}
                          onChange={(e) =>
                            handleItemChange(idx, "unitPrice", e.target.value)
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-right font-mono font-medium focus:bg-white focus:ring-2 focus:ring-slate-300"
                          title="Override Unit Selling Price"
                        />
                      </div>

                      {/* Quantity */}
                      <input
                        type="number"
                        min="1"
                        required
                        value={row.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", e.target.value)
                        }
                        className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-center font-mono"
                        title="Quantity"
                      />

                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Delivery & Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Delivery Charge (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.deliveryFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryFee: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Discount (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountAmount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Real-time Summary Card */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Items Subtotal:</span>
                  <span className="font-mono text-slate-800">
                    ৳{itemsSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge:</span>
                  <span className="font-mono text-slate-800">
                    +৳{formData.deliveryFee}
                  </span>
                </div>
                {formData.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span className="font-mono">
                      -৳{formData.discountAmount}
                    </span>
                  </div>
                )}
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
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-xl"
                >
                  {submitting ? "Creating..." : "Confirm Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  BASA SAJAI
                </h2>
                <p className="text-[11px] text-slate-400">
                  Invoice #{invoiceOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="text-xs space-y-1">
              <div>
                <strong className="text-slate-700">Customer:</strong>{" "}
                {invoiceOrder.customerName}
              </div>
              <div>
                <strong className="text-slate-700">Phone:</strong>{" "}
                {invoiceOrder.customerPhone}
              </div>
              <div>
                <strong className="text-slate-700">Shipping Address:</strong>{" "}
                {invoiceOrder.shippingAddress}
              </div>
            </div>

            {/* Item Breakdown */}
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
                {invoiceOrder.items?.map((item) => (
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
                Delivery Fee: ৳{invoiceOrder.deliveryFee}
              </div>
              {invoiceOrder.discountAmount > 0 && (
                <div className="text-rose-600 font-medium">
                  Discount: -৳{invoiceOrder.discountAmount}
                </div>
              )}
              <div className="text-sm font-bold text-slate-900 font-mono pt-1">
                Grand Total: ৳{invoiceOrder.totalAmount?.toLocaleString()}
              </div>
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
      )}
    </div>
  );
}
