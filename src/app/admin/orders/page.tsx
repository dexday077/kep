"use client";

import { useState } from "react";

interface Order {
  id: string;
  customer: string;
  items: string[];
  totalAmount: number;
  status: string;
  address: string;
  phone: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "Ahmet Yılmaz",
      items: ["Kablosuz Kulaklık Pro X", "USB-C Kablo"],
      totalAmount: 1949,
      status: "delivering",
      address: "Kadıköy, İstanbul",
      phone: "+90 532 123 4567",
      createdAt: "2024-01-15 14:30",
    },
    {
      id: "ORD-002",
      customer: "Ayşe Demir",
      items: ["Akıllı Saat S3"],
      totalAmount: 2399,
      status: "confirmed",
      address: "Çankaya, Ankara",
      phone: "+90 533 234 5678",
      createdAt: "2024-01-15 14:15",
    },
    {
      id: "ORD-003",
      customer: "Mehmet Kaya",
      items: ["Bluetooth Hoparlör Mini", "Gaming Mouse RGB"],
      totalAmount: 1248,
      status: "pending",
      address: "Bornova, İzmir",
      phone: "+90 534 345 6789",
      createdAt: "2024-01-15 14:00",
    },
    {
      id: "ORD-004",
      customer: "Fatma Şahin",
      items: ["Laptop Stand Alüminyum"],
      totalAmount: 459,
      status: "completed",
      address: "Nilüfer, Bursa",
      phone: "+90 535 456 7890",
      createdAt: "2024-01-15 13:45",
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrder(null);
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Siparişler</h2>
          <p className="text-sm text-gray-500 mt-1">
            Toplam {orders.length} sipariş
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Tüm Siparişler</option>
            <option value="pending">Bekleyenler</option>
            <option value="confirmed">Onaylananlar</option>
            <option value="preparing">Hazırlananlar</option>
            <option value="delivering">Teslimatta</option>
            <option value="completed">Tamamlananlar</option>
            <option value="cancelled">İptaller</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Bekleyen",
            count: orders.filter((o) => o.status === "pending").length,
            color: "bg-yellow-100 text-yellow-800",
          },
          {
            label: "Onaylanan",
            count: orders.filter((o) => o.status === "confirmed").length,
            color: "bg-blue-100 text-blue-800",
          },
          {
            label: "Teslimatta",
            count: orders.filter((o) => o.status === "delivering").length,
            color: "bg-orange-100 text-orange-800",
          },
          {
            label: "Tamamlanan",
            count: orders.filter((o) => o.status === "completed").length,
            color: "bg-green-100 text-green-800",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.count}
            </p>
            <span
              className={`inline-block mt-2 rounded-full px-2 py-1 text-xs font-semibold ${stat.color}`}
            >
              Sipariş
            </span>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürünler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item, idx) => (
                        <div key={idx}>{item}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₺{order.totalAmount.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Sipariş bulunamadı</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Sipariş Detayları
            </h3>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Sipariş No</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tarih</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.createdAt}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Müşteri Bilgileri
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-600">Ad Soyad:</span>{" "}
                    <span className="font-medium">
                      {selectedOrder.customer}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Telefon:</span>{" "}
                    <span className="font-medium">{selectedOrder.phone}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Adres:</span>{" "}
                    <span className="font-medium">{selectedOrder.address}</span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Ürünler</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm text-gray-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Toplam Tutar
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₺{selectedOrder.totalAmount.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sipariş Durumunu Güncelle
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "confirmed",
                    "preparing",
                    "delivering",
                    "completed",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, status)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-ghost flex-1"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





