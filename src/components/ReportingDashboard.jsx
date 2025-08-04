import React, { useState, useEffect } from "react";
import { useTranslation } from "../i18n";

// We will get this from the App component later
const API_URL = "https://inventory-management-system-yxam.onrender.com";

export default function ReportingDashboard({ authToken }) {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/reports/low-stock/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch low-stock report.");
        }
        const data = await response.json();
        setLowStockProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLowStockProducts();
  }, [authToken]);

  if (isLoading)
    return <div className="p-8 text-center">{t("reports_loading")}</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        {t("reports_error")} {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t("reports_title")}
      </h1>
      {lowStockProducts.length > 0 ? (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("reports_productName")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("reports_sku")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("reports_quantity")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("reports_threshold")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.low_stock_threshold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {t("reports_allGoodTitle")}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {t("reports_allGoodSubtitle")}
          </p>
        </div>
      )}
    </div>
  );
}
