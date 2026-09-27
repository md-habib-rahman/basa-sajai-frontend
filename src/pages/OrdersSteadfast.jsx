import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Pagination from "../common/Pagination";
import OrderModal from "../components/orders/OrderModal";
import InvoiceModal from "../components/orders/InvoiceModal";
import SteadfastOrdersHeader from "../components/orders/SteadfastOrdersHeader";
import SteadfastOrderFilters from "../components/orders/SteadfastOrderFilters";
import {
  FiPrinter,
  FiTrash2,
  FiEye,
  FiEdit3,
  FiCheckCircle,
} from "react-icons/fi";

export default function OrdersSteadfast() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [steadfastBalance, setSteadfastBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    deliveryFee: 80,
    otherDiscount: 0,
    notes: "",
    items: [{ productId: "", quantity: 1, unitPrice: "", itemDiscount: 0 }],
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

  const fetchSteadfastBalance = async () => {
    try {
      setBalanceLoading(true);
      const res = await api.get("/steadfast/balance");
      if (res.data.success) {
        setSteadfastBalance(res.data.data?.current_balance ?? 0);
      }
    } catch (err) {
      console.warn("Could not load Steadfast balance:", err.message);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchProductsList = async () => {
    try {
      const res = await api.get("/products?limit=100");
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchProductsList();
    fetchSteadfastBalance();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingOrderId(null);
    setFormData({
      customerName: "",
      customerPhone: "",
      shippingAddress: "",
      deliveryFee: 80,
      otherDiscount: 0,
      notes: "",
      items: [{ productId: "", quantity: 1, unitPrice: "", itemDiscount: 0 }],
    });
    setIsOrderModalOpen(true);
  };

  const handleOpenEditModal = (order) => {
    setEditingOrderId(order.id);
    setFormData({
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
      shippingAddress: order.shippingAddress || "",
      deliveryFee: order.deliveryFee ?? 80,
      otherDiscount: order.discountAmount || 0,
      notes: order.notes || "",
      items:
        order.items && order.items.length > 0
          ? order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              itemDiscount: 0,
            }))
          : [{ productId: "", quantity: 1, unitPrice: "", itemDiscount: 0 }],
    });
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const totalItemDiscounts = formData.items.reduce(
        (sum, row) => sum + Number(row.itemDiscount || 0),
        0,
      );
      const calculatedDiscount =
        totalItemDiscounts + Number(formData.otherDiscount || 0);

      const payload = {
        ...formData,
        discountAmount: calculatedDiscount,
      };

      if (editingOrderId) {
        await api.put(`/orders/${editingOrderId}`, payload);
      } else {
        await api.post("/orders", payload);
      }
      setIsOrderModalOpen(false);
      setEditingOrderId(null);
      fetchOrders();
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Failed to save order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToSteadfast = async (orderId) => {
    if (!window.confirm("Send this order to Steadfast Courier?")) return;
    try {
      setDispatchingId(orderId);
      const res = await api.post(`/orders/${orderId}/send-to-steadfast`);
      if (res.data.success) {
        alert(`Dispatched! CID: ${res.data.data?.consignmentId || "Created"}`);
        fetchOrders();
        fetchSteadfastBalance();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Dispatch failed");
    } finally {
      setDispatchingId(null);
    }
  };

  const handleSyncSteadfast = async (orderId) => {
    try {
      setSyncingId(orderId);
      const res = await api.post(`/orders/${orderId}/sync-steadfast`);
      if (res.data.success) fetchOrders();
    } catch (err) {
      alert("Failed to sync Steadfast status");
    } finally {
      setSyncingId(null);
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

  const handleActualReceivedBlur = async (orderId, value, currentStatus) => {
    try {
      const numVal = value === "" ? null : Number(value);
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: currentStatus,
        actualReceivedAmount: numVal,
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, actualReceivedAmount: numVal } : o,
          ),
        );
      }
    } catch (err) {
      alert("Failed to update actual received amount");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
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

  return (
    <div className="space-y-8">
      <SteadfastOrdersHeader
        balance={steadfastBalance}
        balanceLoading={balanceLoading}
        loading={loading}
        onRefreshBalance={fetchSteadfastBalance}
        onRefreshOrders={fetchOrders}
        onCreateOrder={handleOpenCreateModal}
      />

      {/* Filters */}
      <SteadfastOrderFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={(value) => { setSearchQuery(value); setPage(1); }}
        onStatusChange={(value) => { setStatusFilter(value); setPage(1); }}
      />

      {/* Orders Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-center">Courier Tracking</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right text-emerald-800">
                  Actual Received
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {order.customerPhone}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {order.consignmentId ? (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-lg px-2 py-0.5 text-[10px] font-mono">
                          <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>CID: {order.consignmentId}</span>
                          <button
                            onClick={() => handleSyncSteadfast(order.id)}
                            disabled={syncingId === order.id}
                            className="p-0.5 hover:bg-emerald-100 rounded-md transition-colors"
                          >
                            <FiRefreshCw
                              className={`w-2.5 h-2.5 ${
                                syncingId === order.id ? "animate-spin" : ""
                              }`}
                            />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">
                          Not Sent
                        </span>
                      )}
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

                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        placeholder="Courier payout"
                        defaultValue={order.actualReceivedAmount ?? ""}
                        onBlur={(e) =>
                          handleActualReceivedBlur(
                            order.id,
                            e.target.value,
                            order.status,
                          )
                        }
                        className="w-24 text-right bg-emerald-50/60 border border-emerald-200/80 rounded-lg px-2 py-1 text-xs font-mono font-bold text-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                      />
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      {!order.consignmentId && (
                        <button
                          onClick={() => handleSendToSteadfast(order.id)}
                          disabled={dispatchingId === order.id}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Send to Steadfast Courier"
                        >
                          <FiTruck
                            className={`w-3.5 h-3.5 ${
                              dispatchingId === order.id ? "animate-bounce" : ""
                            }`}
                          />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(order)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDirectPrint(order)}
                        className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      >
                        <FiPrinter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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

      {/* Sub-Components */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        editingOrderId={editingOrderId}
        formData={formData}
        setFormData={setFormData}
        products={products}
        onSubmit={handleSaveOrder}
        submitting={submitting}
      />

      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
