"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
	id: string;
	title: string;
	price: number;
	image?: string;
	qty: number;
};

type CartContextValue = {
	items: CartItem[];
	count: number;
	addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
	removeFromCart: (id: string) => void;
	clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	const addToCart = (item: Omit<CartItem, "qty">, qty: number = 1) => {
		setItems((prev) => {
			const idx = prev.findIndex((it) => it.id === item.id);
			if (idx >= 0) {
				const copy = [...prev];
				copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
				return copy;
			}
			return [...prev, { ...item, qty }];
		});
	};

	const removeFromCart = (id: string) => {
		setItems((prev) => prev.filter((it) => it.id !== id));
	};

	const clearCart = () => setItems([]);

	const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);

	const value = useMemo(
		() => ({ items, count, addToCart, removeFromCart, clearCart }),
		[items, count]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
