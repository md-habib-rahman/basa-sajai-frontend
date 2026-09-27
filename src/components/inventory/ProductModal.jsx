import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../../api/products.api";

export const ProductModal = ({ isOpen, onClose, productToEdit = null }) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [actualSellingPrice, setActualSellingPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Populate fields when editing an existing product
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || "");
      setUnitPrice(
        productToEdit.unitPrice !== undefined
          ? String(productToEdit.unitPrice)
          : "",
      );
      setActualSellingPrice(
        productToEdit.actualSellingPrice !== undefined &&
          productToEdit.actualSellingPrice !== null
          ? String(productToEdit.actualSellingPrice)
          : "",
      );
      setStockQuantity(
        productToEdit.stockQuantity !== undefined
          ? String(productToEdit.stockQuantity)
          : "0",
      );
      setImageUrl(productToEdit.imageUrl || "");
    } else {
      resetForm();
    }
    setErrorMessage("");
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setTitle("");
    setUnitPrice("");
    setActualSellingPrice("");
    setStockQuantity("0");
    setImageUrl("");
    setErrorMessage("");
  };

  // Recommended 40% markup hint
  const calculatedRecommendedPrice =
    unitPrice && !isNaN(Number(unitPrice))
      ? Math.round(Number(unitPrice) * 1.4)
      : 0;

  // Create / Update Mutation
  const mutation = useMutation({
    mutationFn: productToEdit ? updateProduct : createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["discrepancy-report"]);
      queryClient.invalidateQueries(["inventory-logs"]);
      onClose();
      resetForm();
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || err.message || "Failed to save product";
      setErrorMessage(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Product title is required.");
      return;
    }

    if (!unitPrice || isNaN(Number(unitPrice)) || Number(unitPrice) < 0) {
      setErrorMessage("Please enter a valid manual unit cost.");
      return;
    }

    const payload = {
      id: productToEdit?.id,
      title: title.trim(),
      unitPrice: Number(unitPrice),
      actualSellingPrice:
        actualSellingPrice !== "" ? Number(actualSellingPrice) : null,
      stockQuantity: Number(stockQuantity || 0),
      imageUrl: imageUrl.trim() || null,
    };

    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {productToEdit ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Premium Velvet Cushion Cover"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Manual Unit Cost */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Unit Cost (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                min="0"
                placeholder="450"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
              {calculatedRecommendedPrice > 0 && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Rec. Selling:{" "}
                  <strong className="text-emerald-600">
                    ৳{calculatedRecommendedPrice}
                  </strong>{" "}
                  (1.4x)
                </p>
              )}
            </div>

            {/* Actual Selling Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Actual Selling Price (৳)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="650"
                value={actualSellingPrice}
                onChange={(e) => setActualSellingPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              placeholder="10"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {productToEdit && (
              <p className="text-[11px] text-slate-400 mt-1">
                Modifying this will log a manual adjustment in the Inventory
                Audit log.
              </p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {mutation.isLoading
                ? "Saving..."
                : productToEdit
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
