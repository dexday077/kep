"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToastContext } from "@/context/ToastContext";
// add-to-cart is only available on product detail page

type Product = {
	id: string;
	title: string;
	price: number;
	image: string;
	rating?: number;
	badge?: string;
};

export default function ProductCard({ product }: { product: Product }) {
	const { addToCart } = useCart();
	const { success } = useToastContext();

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		addToCart(product, 1);
		success("Ürün Sepete Eklendi!", `${product.title} sepetinize eklendi.`);
	};

	return (
		<div className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/product/${product.id}`} className="block">
				<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-white to-slate-50">
					<Image
						src={product.image}
						alt={product.title}
						width={500}
						height={500}
						className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
			</Link>
			<div className="mt-3 space-y-1">
				{product.badge ? (
					<span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
						{product.badge}
					</span>
				) : null}
				<h3 className="line-clamp-2 text-sm font-medium text-slate-900">
					{product.title}
				</h3>
				<div className="flex items-center justify-between">
					<p className="text-base font-semibold">₺{product.price.toLocaleString("tr-TR")}</p>
					{product.rating ? (
						<span className="text-xs text-slate-600">⭐ {product.rating.toFixed(1)}</span>
					) : null}
				</div>
				
				{/* Add to Cart Button */}
				<button
					onClick={handleAddToCart}
					className="w-full mt-3 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors opacity-0 group-hover:opacity-100"
				>
					Sepete Ekle
				</button>
			</div>
		</div>
	);
}
