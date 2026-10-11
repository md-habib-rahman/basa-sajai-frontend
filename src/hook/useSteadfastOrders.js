// src/hooks/useSteadfastOrders.js
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { confirmSend, confirmDelete } from "../lib/confirm";

const errMsg = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function useSteadfastOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState(null);

  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders", {
        params: { page, limit, search: searchQuery, status: statusFilter },
      });
      if (res.data.success) {
        setOrders(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter]);

  const fetchBalance = useCallback(async () => {
    try {
      setBalanceLoading(true);
      const res = await api.get("/steadfast/balance");
      if (res.data.success) setBalance(res.data.data?.current_balance ?? 0);
    } catch (err) {
      console.warn("Could not load Steadfast balance:", err.message);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/products?limit=100");
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchProducts();
    fetchBalance();
  }, [fetchProducts, fetchBalance]);

  const changeSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const changeStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const changeLimit = (value) => {
    setLimit(value);
    setPage(1);
  };

  const sendToSteadfast = async (orderId) => {
    const ok = await confirmSend("This order will be sent to Steadfast.");
    if (!ok) return;
    try {
      setDispatchingId(orderId);
      const res = await api.post(`/orders/${orderId}/send-to-steadfast`);
      if (res.data.success) {
        toast.success(
          `Dispatched! CID: ${res.data.data?.consignmentId || "Created"}`,
        );
        fetchOrders();
        fetchBalance();
      }
    } catch (err) {
      toast.error(errMsg(err, "Dispatch failed"));
    } finally {
      setDispatchingId(null);
    }
  };

  const syncSteadfast = async (orderId) => {
    try {
      setSyncingId(orderId);
      const res = await api.post(`/orders/${orderId}/sync-steadfast`);
      if (res.data.success) fetchOrders();
    } catch {
      toast.error("Failed to sync Steadfast status");
    } finally {
      setSyncingId(null);
    }
  };

  const updateOrderLocally = (orderId, patch) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)),
    );

  // Returns true on success so the cell input knows whether to keep or revert its value
  const updateConsignmentId = async (orderId, value) => {
    if (value !== null && !/^\d+$/.test(String(value).trim())) {
      toast.error("Consignment ID must contain digits only");
      return false;
    }
    try {
      const res = await api.patch(`/orders/${orderId}/consignment`, {
        consignmentId: value,
      });
      if (res.data.success) {
        const { consignmentId, trackingCode, courierStatus, sentToCourierAt } =
          res.data.data;
        updateOrderLocally(orderId, {
          consignmentId,
          trackingCode,
          courierStatus,
          sentToCourierAt,
        });
        toast.success(
          consignmentId ? "Consignment ID saved" : "Consignment ID cleared",
        );
        return true;
      }
    } catch (err) {
      toast.error(errMsg(err, "Failed to update consignment ID"));
    }
    return false;
  };

  const changeStatus = async (orderId, status) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      if (res.data.success) updateOrderLocally(orderId, { status });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const updateActualReceived = async (orderId, value, currentStatus) => {
    try {
      const amount = value === "" ? null : Number(value);
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: currentStatus,
        actualReceivedAmount: amount,
      });
      if (res.data.success)
        updateOrderLocally(orderId, { actualReceivedAmount: amount });
    } catch {
      toast.error("Failed to update actual received amount");
    }
  };

  const deleteOrder = async (orderId) => {
    const ok = await confirmDelete(
      "This order will be soft-deleted from Order List",
    );
    if (!ok) return;
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success("Order Deleted");
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return {
    // data
    orders,
    products,
    meta,
    loading,
    balance,
    balanceLoading,
    // filters / paging
    searchQuery,
    statusFilter,
    page,
    limit,
    setPage,
    changeSearch,
    changeStatusFilter,
    changeLimit,
    // row-level busy state
    dispatchingId,
    syncingId,
    // actions
    fetchOrders,
    fetchBalance,
    sendToSteadfast,
    syncSteadfast,
    updateConsignmentId,
    changeStatus,
    updateActualReceived,
    deleteOrder,
  };
}