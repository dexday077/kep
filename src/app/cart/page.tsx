"use client";

import { useCart } from "@/context/CartContext";
import { useToastContext } from "@/context/ToastContext";
import { LoadingButton } from "@/components/LoadingOverlay";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
	const { items, addToCart, removeFromCart, clearCart } = useCart();
	const { success } = useToastContext();
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
	const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

	const handleQuantityChange = (id: string, newQty: number) => {
		if (newQty <= 0) {
			removeFromCart(id);
		} else {
			const item = items.find(i => i.id === id);
			if (item) {
				addToCart({ id: item.id, title: item.title, price: item.price, image: item.image }, newQty - item.qty);
			}
		}
	};

	const handleCheckout = () => {
		setIsCheckingOut(true);
		// Simulate checkout process
		setTimeout(() => {
			clearCart();
			setIsCheckingOut(false);
			success("Sipariş Başarılı!", "Siparişiniz başarıyla oluşturuldu ve onay e-postası gönderildi.");
		}, 2000);
	};

	if (items.length === 0) {
		return (
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
				<nav className="mb-6 text-sm text-slate-500">
					<Link href="/">Ana Sayfa</Link> / <span>Sepet</span>
				</nav>
				
				<div className="text-center py-16">
					<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span className="text-4xl">🛒</span>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h1>
					<p className="text-gray-600 mb-8">Alışverişe başlamak için ürünleri sepete ekleyin</p>
					<Link 
						href="/"
						className="btn btn-primary px-8 py-3"
					>
						Alışverişe Başla
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
			<nav className="mb-6 text-sm text-slate-500">
				<Link href="/">Ana Sayfa</Link> / <span>Sepet</span>
			</nav>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-2xl font-bold text-gray-900">Sepetim ({totalItems} ürün)</h1>
							<button
								onClick={clearCart}
								className="text-red-600 hover:text-red-700 text-sm font-medium"
							>
								Sepeti Temizle
							</button>
						</div>

						<div className="space-y-4">
							{items.map((item) => (
								<div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
									<div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
										{item.image && (
											<Image
												src={item.image}
												alt={item.title}
												width={80}
												height={80}
												className="w-full h-full object-contain"
											/>
										)}
									</div>
									
									<div className="flex-1">
										<h3 className="font-medium text-gray-900">{item.title}</h3>
										<p className="text-lg font-semibold text-blue-600">₺{item.price.toLocaleString("tr-TR")}</p>
									</div>

									<div className="flex items-center space-x-2">
										<button
											onClick={() => handleQuantityChange(item.id, item.qty - 1)}
											className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
										>
											-
										</button>
										<span className="w-12 text-center font-medium">{item.qty}</span>
										<button
											onClick={() => handleQuantityChange(item.id, item.qty + 1)}
											className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
										>
											+
										</button>
									</div>

									<div className="text-right">
										<p className="text-lg font-semibold text-gray-900">
											₺{(item.price * item.qty).toLocaleString("tr-TR")}
										</p>
										<button
											onClick={() => removeFromCart(item.id)}
											className="text-red-600 hover:text-red-700 text-sm"
										>
											Kaldır
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
						
						<div className="space-y-3 mb-6">
							<div className="flex justify-between">
								<span className="text-gray-600">Ürünler ({totalItems})</span>
								<span className="font-medium">₺{totalPrice.toLocaleString("tr-TR")}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Kargo</span>
								<span className="font-medium text-green-600">
									{totalPrice >= 500 ? "Ücretsiz" : "₺29"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">KDV</span>
								<span className="font-medium">₺{(totalPrice * 0.18).toFixed(0)}</span>
							</div>
							<hr className="border-gray-200" />
							<div className="flex justify-between text-lg font-bold">
								<span>Toplam</span>
								<span className="text-blue-600">
									₺{(totalPrice + (totalPrice >= 500 ? 0 : 29) + (totalPrice * 0.18)).toFixed(0)}
								</span>
							</div>
						</div>

						{totalPrice >= 500 && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
								<p className="text-green-800 text-sm font-medium">
									🎉 Ücretsiz kargo kazandınız!
								</p>
							</div>
						)}

						<LoadingButton
							onClick={handleCheckout}
							isLoading={isCheckingOut}
							loadingText="Sipariş Oluşturuluyor..."
							className="w-full btn btn-primary py-3 text-lg font-semibold"
						>
							Siparişi Tamamla
						</LoadingButton>

						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600">
								Güvenli ödeme ile korunuyorsunuz
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
