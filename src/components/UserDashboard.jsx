import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../i18n.jsx";

export default function UserDashboard({ authToken, userPermissions }) {
  // ... (all existing state variables remain the same)
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: 0,
    location: "",
  });
  const [newProductImage, setNewProductImage] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState(1);
  const [updateType, setUpdateType] = useState("OUT");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const { t } = useTranslation();

  // --- NEW: State to manage the image lightbox ---
  const [lightboxImage, setLightboxImage] = useState(null);

  const canAddProduct = userPermissions.includes("inventory.add_product");
  const canChangeProduct = userPermissions.includes("inventory.change_product");
  const canDeleteProduct = userPermissions.includes("inventory.delete_product");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ... (all your handler functions like fetchProducts, handleAddProduct, etc. remain the same)
  const fetchProducts = async () => {
    if (!authToken) return;
    setIsLoading(true);
    let url = `${API_BASE_URL}/api/products/?location_id=${locationFilter}`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch products.");
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    if (!authToken) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchProducts();
  }, [authToken, locationFilter]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("sku", newProduct.sku);
    formData.append("quantity", newProduct.quantity);
    if (newProduct.location) formData.append("location", newProduct.location);
    if (newProductImage) formData.append("image", newProductImage);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });
      if (!response.ok) throw new Error(await response.text());
      setIsAddModalOpen(false);
      setNewProduct({ name: "", sku: "", quantity: 0, location: "" });
      setNewProductImage(null);
      fetchProducts();
    } catch (err) {
      alert(`Error adding product: ${err.message}`);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: editingProduct.name,
            sku: editingProduct.sku,
            location: editingProduct.location || null,
          }),
        }
      );
      if (!response.ok) throw new Error(JSON.stringify(await response.json()));
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(`Error updating product: ${err.message}`);
    }
  };

  const handleUpdateQuantity = async (e) => {
    e.preventDefault();
    if (!selectedProduct || updateQuantity <= 0) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          product: selectedProduct.id,
          quantity: updateQuantity,
          transaction_type: updateType,
        }),
      });
      if (!response.ok) throw new Error(JSON.stringify(await response.json()));
      setIsUpdateModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(`Error updating stock: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t("dashboard_confirmDelete"))) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!response.ok) throw new Error("Failed to delete the product.");
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadMessage(t("dashboard_uploading"));
    const formData = new FormData();
    formData.append("excel_file", file);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/upload-excel/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setUploadMessage(t("dashboard_uploadSuccess"));
      fetchProducts();
    } catch (err) {
      setUploadMessage(`${t("dashboard_uploadError")} ${err.message}`);
    } finally {
      setTimeout(() => setUploadMessage(""), 5000);
      event.target.value = null;
    }
  };

  if (isLoading) return <div className="p-8">{t("dashboard_loading")}</div>;
  if (error)
    return (
      <div className="p-8 text-red-500">
        {t("dashboard_uploadError")} {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* ... (Header and filter buttons remain the same) ... */}
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-gray-900">
          {t("dashboard_title")}
        </h1>
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm font-medium text-gray-500">
            {t("dashboard_location")}
          </span>
          <button
            onClick={() => setLocationFilter("")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              locationFilter === ""
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("dashboard_all")}
          </button>
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setLocationFilter(loc.id)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                locationFilter == loc.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>
      {canAddProduct && (
        <div className="py-4 border-t border-b border-gray-200 mb-6">
          <div className="flex justify-start space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              {t("dashboard_addProduct")}
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              {t("dashboard_uploadExcel")}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleExcelUpload}
              className="hidden"
              accept=".xlsx, .xls"
            />
          </div>
          {uploadMessage && (
            <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                {/* ... (product text details remain the same) ... */}
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {product.name}
                  </h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {product.location_name || t("dashboard_noLocation")}
                  </span>
                </div>
                <p className="mt-1 text-gray-500 text-sm truncate">
                  {product.sku}
                </p>
                <span
                  className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.quantity <= product.low_stock_threshold
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.quantity} {t("dashboard_inStock")}
                </span>
              </div>
              {/* --- UPDATED: Added onClick to the image --- */}
              <img
                className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0 object-cover cursor-pointer hover:opacity-75 transition"
                src={
                  product.image ||
                  "https://placehold.co/100x100/e2e8f0/e2e8f0?text=Pa-Imazh"
                }
                alt={product.name}
                onClick={() => product.image && setLightboxImage(product.image)}
              />
            </div>
            <div>
              {/* ... (product action buttons remain the same) ... */}
              <div className="-mt-px flex divide-x divide-gray-200">
                {canChangeProduct && (
                  <>
                    <div className="w-0 flex-1 flex">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsUpdateModalOpen(true);
                        }}
                        className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                      >
                        {t("dashboard_updateStock")}
                      </button>
                    </div>
                    <div className="w-0 flex-1 flex border-l">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...product });
                          setIsEditModalOpen(true);
                        }}
                        className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent hover:text-gray-500"
                      >
                        {t("dashboard_editDetails")}
                      </button>
                    </div>
                  </>
                )}
                {canDeleteProduct && (
                  <div className="w-0 flex-1 flex">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-700 font-medium border border-transparent rounded-br-lg hover:text-red-500"
                    >
                      {t("dashboard_delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ... (Add, Edit, and Update modals remain the same) ... */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900">
              {t("modal_addTitle")}
            </h2>
            <form onSubmit={handleAddProduct} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_productName")}
              </label>
              <input
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_sku")}
              </label>
              <input
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_location")}
              </label>
              <select
                value={newProduct.location}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">{t("modal_selectLocation")}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_initialQuantity")}
              </label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    quantity: parseInt(e.target.value, 10),
                  })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_productImage")}
              </label>
              <input
                type="file"
                onChange={(e) => setNewProductImage(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {t("modal_cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  {t("modal_addProductButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900">
              {t("modal_editTitle")}
            </h2>
            <form onSubmit={handleEditProduct} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_productName")}
              </label>
              <input
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_sku")}
              </label>
              <input
                value={editingProduct.sku}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, sku: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_location")}
              </label>
              <select
                value={editingProduct.location || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    location: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">{t("modal_noLocation")}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md border bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {t("modal_cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  {t("modal_saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isUpdateModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900">
              {t("modal_updateTitle")} {selectedProduct.name}
            </h2>
            <p className="text-sm text-gray-500">
              {t("modal_currentQuantity")} {selectedProduct.quantity}
            </p>
            <form onSubmit={handleUpdateQuantity} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_quantity")}
              </label>
              <input
                type="number"
                min="1"
                value={updateQuantity}
                onChange={(e) =>
                  setUpdateQuantity(parseInt(e.target.value, 10))
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("modal_transactionType")}
              </label>
              <select
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="OUT">{t("modal_stockOut")}</option>
                <option value="IN">{t("modal_stockIn")}</option>
              </select>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="rounded-md border bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {t("modal_cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  {t("modal_updateStockButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW: Image Lightbox Modal --- */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)} // Close modal on background click
        >
          <img
            className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0 object-cover cursor-pointer transform hover:scale-105 hover:opacity-80 transition duration-300"
            src={
              product.image ||
              "https://placehold.co/100x100/e2e8f0/e2e8f0?text=Pa-Imazh"
            }
            alt={product.name}
            onClick={() => product.image && setLightboxImage(product.image)}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={() => setLightboxImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
