import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Koleksiyon",
  description: "Sente Wear tek ürün koleksiyonu.",
};

export default function KoleksiyonPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Koleksiyon
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Tek Ürün, 33 Model</h1>
        </div>
        <Link href="/urun/bandana-sapka" className="text-sm text-neutral-600 hover:text-neutral-900">
          Ürüne Git
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="h-52 rounded-2xl bg-neutral-100" />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-neutral-500">33 model seçeneği</p>
            </div>
            <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
          </div>
          <Link
            href="/urun/bandana-sapka"
            className="mt-4 inline-flex rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-500"
          >
            Detayları Gör
          </Link>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-900 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Drop 01
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Bandana Capsule</h2>
          <p className="mt-3 text-sm text-neutral-300">
            Minimal kurgulanmış tek ürün odaklı koleksiyon. Model seçimini üründe
            yapabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
