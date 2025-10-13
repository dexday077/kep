"use client";

import { useState } from "react";

const DEFAULT_CATEGORIES = [
  "Hepsi",
  "Döner",
  "Burger",
  "Sokak Lezzetleri",
  "Tost & Sandviç",
  "Pide & Lahmacun",
  "Pizza",
  "Sushi",
  "Tatlı",
  "Kahve & İçecek",
  "Tavuk",
  "Vejetaryen",
];

export default function CategoryChips({ categories = DEFAULT_CATEGORIES, onChange }: { categories?: string[]; onChange?: (value: string) => void }) {
  const [active, setActive] = useState<string>(categories[0] ?? "Hepsi");

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => handleClick(c)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === c
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}


