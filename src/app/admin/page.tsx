"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 45789,
    totalOrders: 234,
    totalProducts: 89,
    totalCustomers: 1234,
  });

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Ahmet Yılmaz",
      product: "Kablosuz Kulaklık Pro X",
      amount: 1899,
      status: "delivering",
      time: "5 dakika önce",
    },
    {
      id: "ORD-002",
      customer: "Ayşe Demir",
      product: "Akıllı Saat S3",
      amount: 2399,
      status: "confirmed",
      time: "15 dakika önce",
    },
    {
      id: "ORD-003",
      customer: "Mehmet Kaya",
      product: "Bluetooth Hoparlör Mini",
      amount: 749,
      status: "pending",
      time: "30 dakika önce",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "delivering":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Bekliyor",
      confirmed: "Onaylandı",
      preparing: "Hazırlanıyor",
      delivering: "Teslimatta",
      completed: "Tamamlandı",
      cancelled: "İptal",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ₺{stats.totalRevenue.toLocaleString("tr-TR")}
              </p>
              <p className="mt-1 text-sm text-green-600">↑ 12% bu ay</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-3xl">💰</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Toplam Sipariş
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
              <p className="mt-1 text-sm text-green-600">↑ 8% bu ay</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-3xl">🛒</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ürün Sayısı</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalProducts}
              </p>
              <p className="mt-1 text-sm text-gray-500">aktif ürün</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-3xl">📦</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Müşteriler</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalCustomers.toLocaleString("tr-TR")}
              </p>
              <p className="mt-1 text-sm text-green-600">↑ 23% bu ay</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3 text-3xl">👥</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Satış Grafiği
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">📊 Grafik burada görüntülenecek</p>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            En Çok Satan Ürünler
          </h3>
          <div className="space-y-4">
            {[
              { name: "Kablosuz Kulaklık Pro X", sales: 45, amount: 85455 },
              { name: "Akıllı Saat S3", sales: 32, amount: 76768 },
              { name: "Gaming Mouse RGB", sales: 28, amount: 13972 },
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{index + 1}.</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} satış
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ₺{product.amount.toLocaleString("tr-TR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Son Siparişler
          </h3>
          <a
            href="/admin/orders"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Tümünü Gör →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zaman
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₺{order.amount.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



















