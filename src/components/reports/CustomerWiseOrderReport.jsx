import React, { useEffect, useState } from "react";
import { fetchCustomerWiseOrders } from "../../api/reports.api";
import { downloadCsv } from "../../lib/exportCsv";
import Pagination from "../../common/Pagination";
import {
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiUser,
  FiPhone,
  FiChevronDown,
  FiChevronUp,
  FiShoppingBag,
} from "react-icons/fi";

export default function CustomerWiseOrderReport() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchCustomerWiseOrders({
        page,
        limit,
        search: searchQuery,
      });
      if (res.success) {
        setOrders(res.data || []);
        setMeta(res.meta || null);
      }
    } catch (err) {
      console.error("Failed to load customer order report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleExportCsv = () => {
    if (!orders.length) return;

    const rows = orders.map((o) => ({
      "Order Number": o.orderNumber,
      "Customer Name": o.customerName,
      "Customer Phone": o.customerPhone,
      "Shipping Address": o.shippingAddress || "N/A",
      Status: o.status,
      "Total Amount (৳)": o.totalAmount,
      "Items Count": o.items?.length || 0,
      "Items Breakdown":
        o.items?.map((i) => `${i.title} (x${i.quantity})`).join("; ") || "",
      "Order Date": new Date(o.createdAt).toLocaleDateString(),
    }));

    downloadCsv(
      rows,
      [
        "Order Number",
        "Customer Name",
        "Customer Phone",
        "Shipping Address",
        "Status",
        "Total Amount (৳)",
        "Items Count",
        "Items Breakdown",
        "Order Date",
      ],
      `Customer_Order_Report_Page_${page}.csv`,
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={!orders.length}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <FiDownload className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* Customer Orders Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4 text-center">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right font-bold text-slate-900">
                  Total (৳)
                </th>
                <th className="py-3 px-4 text-center">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No customer orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <FiUser className="w-3.5 h-3.5 text-slate-400" />
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                            <FiPhone className="w-3 h-3 text-slate-400" />
                            {order.customerPhone}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadge(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ৳{Number(order.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <FiShoppingBag className="w-3 h-3 text-slate-500" />
                            {order.items?.length || 0} items
                            {isExpanded ? (
                              <FiChevronUp className="w-3 h-3" />
                            ) : (
                              <FiChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Items Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80">
                          <td
                            colSpan="6"
                            className="p-4 border-t border-b border-slate-200/60"
                          >
                            <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-2 max-w-2xl">
                              <p className="font-semibold text-slate-700 border-b border-slate-100 pb-1.5">
                                📦 Item Breakdown for #{order.orderNumber}
                              </p>
                              <div className="divide-y divide-slate-100">
                                {order.items?.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center py-1.5 text-slate-600"
                                  >
                                    <span>
                                      {item.title}{" "}
                                      <strong className="text-slate-900">
                                        x{item.quantity}
                                      </strong>
                                    </span>
                                    <span className="font-mono text-slate-800 font-medium">
                                      ৳
                                      {Number(
                                        item.unitPrice || 0,
                                      ).toLocaleString()}{" "}
                                      / unit
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {order.shippingAddress && (
                                <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                                  <strong>Shipping Address:</strong>{" "}
                                  {order.shippingAddress}
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-4">
          <Pagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
