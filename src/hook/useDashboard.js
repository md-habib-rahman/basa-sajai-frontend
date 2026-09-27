import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const res = await api.get("/dashboard/summary");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 3, // Data remains fresh for 3 minutes
  });
}
