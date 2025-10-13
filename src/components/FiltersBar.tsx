"use client";

import { useState } from "react";

export type Filters = {
	sort: "popularity" | "priceAsc" | "priceDesc";
	minPrice?: number;
	maxPrice?: number;
};

export default function FiltersBar({ onChange, showSort = false }: { onChange: (f: Filters) => void; showSort?: boolean }) {
	const [sort, setSort] = useState<Filters["sort"]>("popularity");
	const [minPrice, setMinPrice] = useState<string>("");
	const [maxPrice, setMaxPrice] = useState<string>("");

	const apply = () => {
		onChange({
			sort,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
		});
	};

	const handleSortChange = (newSort: Filters["sort"]) => {
		setSort(newSort);
		onChange({
			sort: newSort,
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
		});
	};

	return (
		<div className="surface flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
			{showSort && (
				<div className="flex items-center gap-2">
					<label className="text-sm text-slate-600">Sırala</label>
					<select
						value={sort}
						onChange={(e) => handleSortChange(e.target.value as Filters["sort"])}
						className="h-9 rounded-full border border-black/10 bg-white px-3 text-sm"
					>
						<option value="popularity">Popüler</option>
						<option value="priceAsc">Fiyat: En ucuz</option>
						<option value="priceDesc">Fiyat: En Pahalı</option>
					</select>
				</div>
			)}
			{showSort && (
				<div className="flex items-center gap-2">
					<label className="text-sm text-slate-600">Fiyat</label>
					<input
						type="number"
						placeholder="Min"
						value={minPrice}
						onChange={(e) => setMinPrice(e.target.value)}
						className="h-9 w-24 rounded-full border border-black/10 bg-white px-3 text-sm"
					/>
					<span className="text-slate-400">—</span>
					<input
						type="number"
						placeholder="Max"
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
						className="h-9 w-24 rounded-full border border-black/10 bg-white px-3 text-sm"
					/>
					<button onClick={apply} className="btn btn-ghost">Uygula</button>
				</div>
			)}
		</div>
	);
}
