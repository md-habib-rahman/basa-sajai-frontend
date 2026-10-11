// src/hooks/useOrderForm.js
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import {
  emptyOrderForm,
  orderToForm,
  buildOrderPayload,
} from "../lib/orderForm";

export default function useOrderForm({ onSaved } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [formData, setFormData] = useState(emptyOrderForm());
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditingOrderId(null);
    setFormData(emptyOrderForm());
    setIsOpen(true);
  };

  const openEdit = (order) => {
    setEditingOrderId(order.id);
    setFormData(orderToForm(order));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingOrderId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = buildOrderPayload(formData);

      if (editingOrderId) {
        await api.put(`/orders/${editingOrderId}`, payload);
      } else {
        await api.post("/orders", payload);
      }

      close();
      onSaved?.();
      toast.success("Order saved successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isOpen,
    editingOrderId,
    formData,
    setFormData,
    submitting,
    openCreate,
    openEdit,
    close,
    submit,
  };
}
