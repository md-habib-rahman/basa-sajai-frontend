import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { uploadToImgBB } from "../lib/imgbb";
import Pagination from "../common/Pagination";
import {
  FiBox,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiEdit3,
  FiImage,
  FiUpload,
} from "react-icons/fi";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stockUpdatingId, setStockUpdatingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    stockQuantity: 1,
    purchaseQuantity: 1,
    totalPurchasePrice: 0,
    shippingCost: 0,
    marketingCost: 0,
    packagingCost: 0,
    actualSellingPrice: "",
    imageUrl: "",
  });

  const [stockFormData, setStockFormData] = useState({
    productId: null,
    title: "",
    currentStock: 0,
    adjustment: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products?page=${page}&limit=${limit}&search=${searchQuery}`,
      );
      if (res.data.success) {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "title" ? value : value === "" ? "" : Number(value),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview("");
    setFormData({
      title: "",
      stockQuantity: 1,
      purchaseQuantity: 1,
      totalPurchasePrice: 0,
      shippingCost: 0,
      marketingCost: 0,
      packagingCost: 0,
      actualSellingPrice: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    setSelectedFile(null);
    setImagePreview(product.imageUrl || "");
    setFormData({
      title: product.title,
      stockQuantity: product.stockQuantity,
      purchaseQuantity: product.purchaseQuantity || product.stockQuantity || 1,
      totalPurchasePrice: product.totalPurchasePrice,
      shippingCost: product.shippingCost,
      marketingCost: product.marketingCost,
      packagingCost: product.packagingCost,
      actualSellingPrice: product.actualSellingPrice || "",
      imageUrl: product.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  // Costing is based on the original purchase quantity, not current stock.
  // Orders can reduce stock without changing the stored cost.
  const calculatedUnitCost =
    Number(formData.purchaseQuantity) > 0
      ? (Number(formData.totalPurchasePrice || 0) +
          Number(formData.shippingCost || 0)) /
        Number(formData.purchaseQuantity)
      : 0;

  const unitCost = editingId
    ? Number(
        products.find((p) => p.id === editingId)?.unitPrice ??
          calculatedUnitCost,
      )
    : calculatedUnitCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        finalImageUrl = await uploadToImgBB(selectedFile);
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.message || "Failed to save record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInlineUpdate = async (id, field, value) => {
    try {
      const res = await api.patch(`/products/${id}`, {
        [field]: Number(value),
      });
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? res.data.data : p)),
        );
      }
    } catch (err) {
      alert("Failed to update cost");
    }
  };

  const handleOpenStockModal = (product) => {
    setStockFormData({
      productId: product.id,
      title: product.title,
      currentStock: Number(product.stockQuantity || 0),
      adjustment: 0,
    });
    setIsStockModalOpen(true);
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;
    setStockFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();

    const adjustment = Number(stockFormData.adjustment || 0);

    if (adjustment === 0) {
      alert("Please enter a stock adjustment.");
      return;
    }

    const newStock = Number(stockFormData.currentStock) + adjustment;

    if (newStock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    try {
      setStockUpdatingId(stockFormData.productId);

      const res = await api.patch(`/products/${stockFormData.productId}`, {
        stockQuantity: newStock,
      });

      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === stockFormData.productId ? res.data.data : p,
          ),
        );
        setIsStockModalOpen(false);
      }
    } catch (err) {
      alert(err.message || "Failed to update stock");
    } finally {
      setStockUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory item?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiBox className="w-4 h-4 text-slate-500" />
            Inventory & Costing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage inventory, fixed purchase costing, and stock adjustments.
            Costing changes only when edited manually.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5" />
            New Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or SKU..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {/* Product Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Marketing Cost</th>
                <th className="py-3 px-4 text-right">Packaging Cost</th>
                <th className="py-3 px-4 text-right">Landed Cost</th>
                <th className="py-3 px-4 text-right text-slate-500">
                  Suggested Price (+40%)
                </th>
                <th className="py-3 px-4 text-right text-emerald-700">
                  Actual Selling Price
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                          <FiImage className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    {/* Title / SKU */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {item.sku}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {item.stockQuantity}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ৳{item.unitPrice?.toFixed(1)}
                    </td>

                    {/* Editable Marketing */}
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        defaultValue={item.marketingCost}
                        onBlur={(e) =>
                          handleInlineUpdate(
                            item.id,
                            "marketingCost",
                            e.target.value,
                          )
                        }
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-slate-300"
                      />
                    </td>

                    {/* Editable Packaging */}
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        defaultValue={item.packagingCost}
                        onBlur={(e) =>
                          handleInlineUpdate(
                            item.id,
                            "packagingCost",
                            e.target.value,
                          )
                        }
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-slate-300"
                      />
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-slate-800 font-mono">
                      ৳{item.totalLandedCost?.toFixed(1)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-400 text-xs">
                      ৳{item.sellingPrice?.toLocaleString()}
                    </td>

                    {/* Inline Editable Actual Selling Price */}
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        defaultValue={
                          item.actualSellingPrice || item.sellingPrice
                        }
                        onBlur={(e) =>
                          handleInlineUpdate(
                            item.id,
                            "actualSellingPrice",
                            e.target.value,
                          )
                        }
                        className="w-24 text-right bg-emerald-50/60 border border-emerald-200/80 rounded-lg px-2 py-1 text-xs font-mono font-bold text-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                      />
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit costing"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenStockModal(item)}
                        title="Update stock"
                        className="px-2 py-1 text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Stock
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete product"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 pb-4">
          <Pagination
            meta={meta}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                {editingId ? "Edit Inventory Costing" : "Add Inventory Item"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Product Photo
                </label>

                <div className="flex items-center justify-between gap-3">
                  {/* Image + Upload */}
                  <div className="flex items-center gap-3">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <FiImage className="w-5 h-5" />
                      </div>
                    )}

                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100">
                      <FiUpload className="w-3.5 h-3.5" />
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Per Unit Cost */}
                  <div className="min-w-[110px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                    <p className="text-[10px] font-medium text-slate-500">
                      Per Unit Cost
                    </p>

                    <p className="text-sm font-semibold font-mono text-slate-900">
                      ৳ {unitCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Purchase Quantity *
                  </label>
                  <input
                    type="number"
                    name="purchaseQuantity"
                    min="1"
                    required
                    value={formData.purchaseQuantity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Total Price (৳) *
                  </label>
                  <input
                    type="number"
                    name="totalPurchasePrice"
                    min="0"
                    required
                    value={formData.totalPurchasePrice}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              {editingId && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">
                      Current Stock
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {formData.stockQuantity} pcs
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const product = products.find((p) => p.id === editingId);
                      if (product) {
                        setIsModalOpen(false);
                        handleOpenStockModal(product);
                      }
                    }}
                    className="px-2.5 py-1.5 text-[10px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                  >
                    Update Stock
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Shipping Cost (৳)
                  </label>
                  <input
                    type="number"
                    name="shippingCost"
                    min="0"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Actual Selling Price (৳)
                  </label>
                  <input
                    type="number"
                    name="actualSellingPrice"
                    min="0"
                    placeholder="Optional override"
                    value={formData.actualSellingPrice}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-xl"
                >
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Stock Update Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Update Stock
                </h2>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {stockFormData.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[10px] text-slate-500">Current Stock</p>
                  <p className="text-sm font-semibold font-mono text-slate-900 mt-0.5">
                    {stockFormData.currentStock} pcs
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[10px] text-slate-500">New Stock</p>
                  <p className="text-sm font-semibold font-mono text-slate-900 mt-0.5">
                    {Math.max(
                      0,
                      Number(stockFormData.currentStock || 0) +
                        Number(stockFormData.adjustment || 0),
                    )}{" "}
                    pcs
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Stock Adjustment *
                </label>
                <input
                  type="number"
                  name="adjustment"
                  value={stockFormData.adjustment}
                  onChange={handleStockInputChange}
                  placeholder="e.g. 25 or -5"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Positive number adds stock; negative number reduces stock.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={stockUpdatingId === stockFormData.productId}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-xl disabled:opacity-50"
                >
                  {stockUpdatingId === stockFormData.productId
                    ? "Updating..."
                    : "Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
