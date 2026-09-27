import { api } from "../lib/api";

export const fetchCustomerSuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const res = await api.get("/orders/customers/suggest", {
    params: { q: query },
  });
  return res.data?.data || [];
};