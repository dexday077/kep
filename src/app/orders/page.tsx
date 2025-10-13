"use client";

import Link from "next/link";
import { useState } from "react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
	id: string;
	title: string;
	price: number;
	image?: string;
	qty: number;
};

type Order = {
	id: string;
	date: string;
	status: OrderStatus;
	items: OrderItem[];
	total: number;
	trackingNumber?: string;
	estimatedDelivery?: string;
};

// Mock order data
const mockOrders: Order[] = [
	{
		id: "ORD-2024-001",
		date: "2024-01-15",
		status: "delivered",
		items: [
			{ id: "1", title: "Kablosuz Kulaklık Pro X", price: 1899, image: "/window.svg", qty: 1 },
			{ id: "2", title: "Akıllı Saat S3", price: 2399, image: "/globe.svg", qty: 1 }
		],
		total: 4298,
		trackingNumber: "TRK123456789",
		estimatedDelivery: "2024-01-18"
	},
	{
		id: "ORD-2024-002",
		date: "2024-01-20",
		status: "shipped",
		items: [
			{ id: "3", title: "Bluetooth Hoparlör Mini", price: 749, image: "/file.svg", qty: 2 }
		],
		total: 1498,
		trackingNumber: "TRK987654321",
		estimatedDelivery: "2024-01-25"
	},
	{
		id: "ORD-2024-003",
		date: "2024-01-22",
		status: "processing",
		items: [
			{ id: "4", title: "Oyun Mouse RGB", price: 499, image: "/next.svg", qty: 1 },
			{ id: "5", title: "USB-C Hızlı Şarj Adaptörü", price: 329, image: "/vercel.svg", qty: 1 }
		],
		total: 828
	}
];

const statusLabels: Record<OrderStatus, string> = {
	pending: "Beklemede",
	processing: "Hazırlanıyor",
	shipped: "Kargoya Verildi",
	delivered: "Teslim Edildi",
	cancelled: "İptal Edildi"
};

const statusColors: Record<OrderStatus, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	processing: "bg-blue-100 text-blue-800",
	shipped: "bg-purple-100 text-purple-800",
	delivered: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800"
};

export default function OrdersPage() {
	const [filter, setFilter] = useState<OrderStatus | "all">("all");
	
	const filteredOrders = filter === "all" 
		? mockOrders 
		: mockOrders.filter(order => order.status === filter);

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
			<nav className="mb-6 text-sm text-slate-500">
				<Link href="/">Ana Sayfa</Link> / <span>Siparişlerim</span>
			</nav>

			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
				<p className="text-gray-600">Tüm siparişlerinizi buradan takip edebilirsiniz</p>
			</div>

			{/* Filter Tabs */}
			<div className="mb-8">
				<div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							filter === "all" 
								? "bg-white text-gray-900 shadow-sm" 
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						Tümü ({mockOrders.length})
					</button>
					{Object.entries(statusLabels).map(([status, label]) => {
						const count = mockOrders.filter(order => order.status === status).length;
						return (
							<button
								key={status}
								onClick={() => setFilter(status as OrderStatus)}
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
									filter === status 
										? "bg-white text-gray-900 shadow-sm" 
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								{label} ({count})
							</button>
						);
					})}
				</div>
			</div>

			{/* Orders List */}
			<div className="space-y-6">
				{filteredOrders.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-4xl">📦</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
						<p className="text-gray-600 mb-8">Bu durumda sipariş bulunmuyor</p>
						<Link href="/" className="btn btn-primary px-8 py-3">
							Alışverişe Başla
						</Link>
					</div>
				) : (
					filteredOrders.map((order) => (
						<div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							{/* Order Header */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										Sipariş #{order.id}
									</h3>
									<p className="text-sm text-gray-600">
										{new Date(order.date).toLocaleDateString("tr-TR", {
											year: "numeric",
											month: "long",
											day: "numeric"
										})}
									</p>
								</div>
								<div className="flex items-center space-x-4 mt-2 sm:mt-0">
									<span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
										{statusLabels[order.status]}
									</span>
									<span className="text-lg font-bold text-gray-900">
										₺{order.total.toLocaleString("tr-TR")}
									</span>
								</div>
							</div>

							{/* Order Items */}
							<div className="space-y-3 mb-4">
								{order.items.map((item) => (
									<div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
										<div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
											{item.image && (
												<img
													src={item.image}
													alt={item.title}
													className="w-full h-full object-contain"
												/>
											)}
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-gray-900">{item.title}</h4>
											<p className="text-sm text-gray-600">Adet: {item.qty}</p>
										</div>
										<div className="text-right">
											<p className="font-semibold text-gray-900">
												₺{(item.price * item.qty).toLocaleString("tr-TR")}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* Order Actions */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
								<div className="space-y-2 sm:space-y-0 sm:space-x-4">
									{order.trackingNumber && (
										<p className="text-sm text-gray-600">
											Takip No: <span className="font-medium">{order.trackingNumber}</span>
										</p>
									)}
									{order.estimatedDelivery && order.status !== "delivered" && (
										<p className="text-sm text-gray-600">
											Tahmini Teslimat: {new Date(order.estimatedDelivery).toLocaleDateString("tr-TR")}
										</p>
									)}
								</div>
								<div className="flex space-x-3 mt-4 sm:mt-0">
									<button className="btn btn-ghost px-4 py-2 text-sm">
										Detayları Gör
									</button>
									{order.status === "delivered" && (
										<button className="btn btn-primary px-4 py-2 text-sm">
											Tekrar Sipariş Ver
										</button>
									)}
									{order.status === "pending" && (
										<button className="btn btn-ghost px-4 py-2 text-sm text-red-600 hover:text-red-700">
											İptal Et
										</button>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
