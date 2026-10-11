// src/pages/OrdersSteadfast.jsx
import React, { useState } from "react";
import OrderModal from "../components/orders/OrderModal";
import InvoiceModal from "../components/orders/InvoiceModal";
import SteadfastOrdersHeader from "../components/orders/SteadfastOrdersHeader";
import SteadfastOrderFilters from "../components/orders/SteadfastOrderFilters";
import SteadfastOrdersTable from "../components/orders/SteadfastOrdersTable";
import useSteadfastOrders from "../hook/useSteadfastOrders";
import useOrderForm from "../hook/useOrderForm";

export default function OrdersSteadfast() {
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const {
    orders,
    products,
    meta,
    loading,
    balance,
    balanceLoading,
    searchQuery,
    statusFilter,
    page,
    limit,
    setPage,
    changeSearch,
    changeStatusFilter,
    changeLimit,
    dispatchingId,
    syncingId,
    fetchOrders,
    fetchBalance,
    sendToSteadfast,
    syncSteadfast,
    updateConsignmentId,
    changeStatus,
    updateActualReceived,
    deleteOrder,
  } = useSteadfastOrders();

  const orderForm = useOrderForm({ onSaved: fetchOrders });

  const handleDirectPrint = (order) => {
    setInvoiceOrder(order);
    setTimeout(() => window.print(), 150);
  };

  return (
    <div className="space-y-8">
      <SteadfastOrdersHeader
        balance={balance}
        balanceLoading={balanceLoading}
        loading={loading}
        onRefreshBalance={fetchBalance}
        onRefreshOrders={fetchOrders}
        onCreateOrder={orderForm.openCreate}
      />

      <SteadfastOrderFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={changeSearch}
        onStatusChange={changeStatusFilter}
      />

      <SteadfastOrdersTable
        orders={orders}
        loading={loading}
        meta={meta}
        page={page}
        limit={limit}
        syncingId={syncingId}
        dispatchingId={dispatchingId}
        onPageChange={setPage}
        onLimitChange={changeLimit}
        rowHandlers={{
          onSync: syncSteadfast,
          onConsignmentSave: updateConsignmentId,
          onStatusChange: changeStatus,
          onActualReceivedCommit: updateActualReceived,
          onDispatch: sendToSteadfast,
          onEdit: orderForm.openEdit,
          onView: setInvoiceOrder,
          onPrint: handleDirectPrint,
          onDelete: deleteOrder,
        }}
      />

      <OrderModal
        isOpen={orderForm.isOpen}
        onClose={orderForm.close}
        editingOrderId={orderForm.editingOrderId}
        formData={orderForm.formData}
        setFormData={orderForm.setFormData}
        products={products}
        onSubmit={orderForm.submit}
        submitting={orderForm.submitting}
      />

      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
