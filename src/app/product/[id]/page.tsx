"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  rating?: number;
};

function getMockProduct(id: string): Product {
  return {
    id,
    title: "Kablosuz Kulaklık Pro X",
    description:
      "Aktif gürültü engelleme, net mikrofon ve uzun pil ömrü ile her yerde müzik keyfi.",
    price: 1899,
    images: ["/window.svg", "/globe.svg", "/file.svg"],
    rating: 4.6,
  };
}

export default function ProductPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const product = getMockProduct(id);
  const { addToCart } = useCart();
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const canDecrease = useMemo(() => quantity > 1, [quantity]);
  const canIncrease = useMemo(() => quantity < 10, [quantity]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/">Ana Sayfa</Link> / <span>Ürün</span>
      </nav>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-white border border-black/5">
            <Image
              src={product.images[activeImageIdx]}
              alt={product.title}
              width={800}
              height={800}
              className="h-full w-full object-contain p-6"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`aspect-square overflow-hidden rounded-lg bg-white border ${
                  activeImageIdx === i
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-black/5"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {product.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ⭐ {product.rating?.toFixed(1)}
          </p>
          <p className="mt-4 text-3xl font-bold">
            ₺{product.price.toLocaleString("tr-TR")}
          </p>
          <p className="mt-4 text-slate-700">{product.description}</p>

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div className="rounded-lg border border-black/5 bg-white p-3">
              <p className="font-medium text-slate-900">Teslimat</p>
              <p className="mt-1">Hızlı kargo: 1-3 iş günü içinde teslim.</p>
            </div>
            <div className="rounded-lg border border-black/5 bg-white p-3">
              <p className="font-medium text-slate-900">Stok Durumu</p>
              <p className="mt-1">Stokta var (20+)</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white">
              <button
                onClick={() =>
                  canDecrease && setQuantity((q) => Math.max(1, q - 1))
                }
                className={`h-10 w-10 rounded-l-full text-lg ${
                  canDecrease
                    ? "hover:bg-slate-50"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => {
                  const v = Number(e.target.value || 1);
                  if (!Number.isNaN(v))
                    setQuantity(Math.min(10, Math.max(1, v)));
                }}
                className="h-10 w-14 text-center outline-none"
              />
              <button
                onClick={() =>
                  canIncrease && setQuantity((q) => Math.min(10, q + 1))
                }
                className={`h-10 w-10 rounded-r-full text-lg ${
                  canIncrease
                    ? "hover:bg-slate-50"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                +
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  addToCart(
                    {
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.images[activeImageIdx],
                    },
                    quantity
                  )
                }
                className="btn btn-primary px-6"
              >
                Sepete Ekle
              </button>
              <button className="btn btn-ghost px-6">Hemen Al</button>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex gap-2 border-b border-black/5">
              <button
                onClick={() => setTab("desc")}
                className={`h-10 rounded-t-md px-3 text-sm ${
                  tab === "desc"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Açıklama
              </button>
              <button
                onClick={() => setTab("specs")}
                className={`h-10 rounded-t-md px-3 text-sm ${
                  tab === "specs"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Özellikler
              </button>
              <button
                onClick={() => setTab("reviews")}
                className={`h-10 rounded-t-md px-3 text-sm ${
                  tab === "reviews"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Yorumlar
              </button>
            </div>
            <div className="pt-4 text-sm text-slate-700">
              {tab === "desc" && (
                <div className="space-y-2">
                  <p>
                    Kulaklıkta ANC, düşük gecikme modu ve Type-C hızlı şarj
                    bulunur.
                  </p>
                  <ul className="list-disc pl-5">
                    <li>Şeffaflık modu</li>
                    <li>Ergonomik ve hafif tasarım</li>
                    <li>iOS ve Android ile uyumlu</li>
                  </ul>
                </div>
              )}
              {tab === "specs" && (
                <div className="overflow-x-auto">
                  <table className="min-w-[400px] text-sm">
                    <tbody className="divide-y divide-black/5">
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Bağlantı</td>
                        <td className="py-2">Bluetooth 5.3</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Pil Ömrü</td>
                        <td className="py-2">40 saat</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Şarj</td>
                        <td className="py-2">USB‑C</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {tab === "reviews" && <p>Henüz yorum yok. İlk yorumu sen yaz!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
