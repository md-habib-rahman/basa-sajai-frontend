import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchDiscrepancyReport,
  patchProductStock,
  softDeleteProduct,
} from "../api/products.api";
import { InventoryLogsDrawer } from "../components/inventory/InventoryLogsDrawer";

export const InventoryPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  //Fetch Products List
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => fetchProducts({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  // Fetch Discrepancy Report
  const { data: discrepancyData } = useQuery({
    queryKey: ["discrepancy-report"],
    queryFn: fetchDiscrepancyReport,
  });

  // Patch Stock Mutation
  const patchStockMutation = useMutation({
    mutationFn: patchProductStock,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["discrepancy-report"]);
      queryClient.invalidateQueries(["inventory-logs"]);
      setEditingStockId(null);
    },
  });

  // Soft Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: softDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["discrepancy-report"]);
    },
  });

//   const products = productsData?.data || [];
//   const meta = productsData?.meta || { page: 1, totalPages: 1 };
  const discrepancies =
    discrepancyData?.data?.filter((d) => d.hasDiscrepancy) || [];

//   const handleStockSave = (productId) => {
//     if (newStockValue === "" || isNaN(Number(newStockValue))) return;
//     patchStockMutation.mutate({
//       id: productId,
//       stockQuantity: Number(newStockValue),
//     });
//   };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inventory & Stock Control
          </h1>
          <p className="text-sm text-slate-500">
            Monitor physical inventory, adjust stock levels, and audit logs.
          </p>
        </div>
        {/* <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm"
        >
          📋 View Audit Logs
        </button> */}
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepancies.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start justify-between">
          <div>
            <div className="font-bold text-amber-900 text-sm flex items-center">
              ⚠️ Stock Discrepancy Detected ({discrepancies.length} Product
              {discrepancies.length > 1 ? "s" : ""})
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Some physical stock levels do not align with historical order
              movement logs.
            </p>
          </div>
          {/* <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-xs font-semibold text-amber-900 underline hover:text-amber-800"
          >
            Audit Logs →
          </button> */}
        </div>
      )}

      <InventoryLogsDrawer />

      {/* Logs Drawer */}
      {/* <InventoryLogsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      /> */}
    </div>
  );
};
