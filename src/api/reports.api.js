import { api } from "../lib/api";

/**
 * Fetch Item-Wise Inventory Report (Stock In, Stock Out, Current Stock)
 */
export const fetchItemWiseInventory = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get("/reports/inventory/item-wise", {
    params: { page, limit, search },
  });
  return response.data;
};

/**
 * Fetch Date-Wise Inventory Movement Report
 */
export const fetchDateWiseInventory = async ({ startDate = "", endDate = "" } = {}) => {
  const response = await api.get("/reports/inventory/date-wise", {
    params: { startDate, endDate },
  });
  return response.data;
};

/**
 * Fetch Paginated Customer-wise Order History
 */
export const fetchCustomerWiseOrders = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get("/reports/orders/customer-wise", {
    params: { page, limit, search },
  });
  return response.data;
};