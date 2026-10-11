// src/lib/orderForm.js
export const DEFAULT_DELIVERY_FEE = 80;

export const emptyItem = () => ({
  productId: "",
  quantity: 1,
  unitPrice: "",
  itemDiscount: 0,
});

export const emptyOrderForm = () => ({
  customerName: "",
  customerPhone: "",
  shippingAddress: "",
  deliveryFee: DEFAULT_DELIVERY_FEE,
  otherDiscount: 0,
  notes: "",
  items: [emptyItem()],
});

export const orderToForm = (order) => {
  const items =
    order.items && order.items.length > 0
      ? order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          itemDiscount: item.itemDiscount || 0,
        }))
      : [emptyItem()];

  // order.discountAmount = item discounts + order-level discount,
  // so the form's "Other Discount" is only the order-level remainder.
  const itemDiscountTotal = items.reduce(
    (sum, row) => sum + Number(row.itemDiscount || 0),
    0,
  );

  return {
    customerName: order.customerName || "",
    customerPhone: order.customerPhone || "",
    shippingAddress: order.shippingAddress || "",
    deliveryFee: order.deliveryFee ?? DEFAULT_DELIVERY_FEE,
    otherDiscount: Math.max(0, (order.discountAmount || 0) - itemDiscountTotal),
    notes: order.notes || "",
    items,
  };
};

// The server recalculates every total; discountAmount is kept for older API versions.
export const buildOrderPayload = (formData) => {
  const totalItemDiscounts = formData.items.reduce(
    (sum, row) => sum + Number(row.itemDiscount || 0),
    0,
  );
  return {
    ...formData,
    discountAmount: totalItemDiscounts + Number(formData.otherDiscount || 0),
  };
};
