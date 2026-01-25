import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "Sente Wear tek ürün koleksiyonu: Bandanalı Şapka.",
};

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Premium streetwear
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Bandanalı Şapka ile sade, iddialı ve zamansız bir duruş.
          </h1>
          <p className="text-sm text-neutral-600 md:text-base">
            Sente Wear için özel üretim. 33 farklı model, tek fiyat ve tek ürün
            odağıyla minimal bir alışveriş deneyimi.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/urun/bandana-sapka"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Ürünü İncele
            </Link>
            <Link
              href="/koleksiyon"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-500"
            >
              Koleksiyona Göz At
            </Link>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
            <p className="text-neutral-500">Tek fiyat</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff20,_transparent_60%)]" />
          <div className="relative space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-300">
              Bandana drop
            </p>
            <h2 className="text-2xl font-semibold">Bandanalı Şapka</h2>
            <p className="text-sm text-neutral-300">
              33 model seçenekli premium detay. Hafif, ayarlanabilir ve günlük kullanım
              için ideal.
            </p>
            <div className="h-40 rounded-2xl border border-white/20 bg-white/5" />
            <Link
              href="/urun/bandana-sapka"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-xs font-medium text-white"
            >
              Model Seçimi Yap
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "33 Model",
            text: "Her biri farklı kombinlere uyum sağlayan seçkiler.",
          },
          {
            title: "Tek Fiyat",
            text: "Şeffaf fiyatlandırma, tek ürün mantığı.",
          },
          {
            title: "Havale/EFT",
            text: "Hızlı bildirim ve doğrudan ödeme akışı.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-neutral-200 bg-white p-6"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
