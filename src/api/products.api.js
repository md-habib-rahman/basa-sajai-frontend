import { api } from "../lib/api";

export const fetchProducts = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get(`/products?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const fetchInventoryLogs = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get(`/products/inventory-logs?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const fetchDiscrepancyReport = async () => {
  const response = await api.get("/products/discrepancy-report");
  return response.data;
};

export const patchProductStock = async ({ id, stockQuantity }) => {
  const response = await api.patch(`/products/${id}`, { stockQuantity });
  return response.data;
};

export const softDeleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};