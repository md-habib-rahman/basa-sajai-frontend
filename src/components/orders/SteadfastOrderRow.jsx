// src/components/orders/SteadfastOrderRow.jsx
import React from "react";
import CourierTrackingCell from "./CourierTrackingCell";
import OrderStatusSelect from "./OrderStatusSelect";
import ActualReceivedInput from "./ActualReceivedInput";
import OrderRowActions from "./OrderRowActions";

export default function SteadfastOrderRow({
  order,
  serial,
  syncing,
  dispatching,
  onSync,
  onConsignmentSave,
  onStatusChange,
  onActualReceivedCommit,
  onDispatch,
  onEdit,
  onView,
  onPrint,
  onDelete,
}) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
        {serial}
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
        <CourierTrackingCell
          consignmentId={order.consignmentId}
          syncing={syncing}
          onSync={() => onSync(order.id)}
          onSave={(value) => onConsignmentSave(order.id, value)}
        />
      </td>
      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
        ৳{order.totalAmount?.toLocaleString()}
      </td>
      <td className="py-3 px-4">
        <OrderStatusSelect
          value={order.status}
          onChange={(status) => onStatusChange(order.id, status)}
        />
      </td>
      <td className="py-3 px-4 text-right">
        <ActualReceivedInput
          value={order.actualReceivedAmount}
          onCommit={(value) =>
            onActualReceivedCommit(order.id, value, order.status)
          }
        />
      </td>
      <td className="py-3 px-4 text-right">
        <OrderRowActions
          canDispatch={!order.consignmentId}
          dispatching={dispatching}
          onDispatch={() => onDispatch(order.id)}
          onEdit={() => onEdit(order)}
          onView={() => onView(order)}
          onPrint={() => onPrint(order)}
          onDelete={() => onDelete(order.id)}
        />
      </td>
    </tr>
  );
}
