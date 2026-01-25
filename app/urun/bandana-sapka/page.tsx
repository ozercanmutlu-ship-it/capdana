import type { Metadata } from "next";
import { ProductPurchase } from "@/components/ProductPurchase";
import { product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Bandanalı Şapka",
  description: "Sente Wear bandanalı şapka. 33 model, tek fiyat.",
};

export default function ProductPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-8">
            <div className="h-64 w-full rounded-2xl bg-white" />
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Ürün Detayları</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>Premium pamuklu bandana detay</li>
              <li>Ayarlanabilir arka bant</li>
              <li>Günlük kullanım için hafif yapı</li>
              <li>Tek fiyat, 33 farklı model seçeneği</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Bakım & Bilgi</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Ürünü düşük ısıda temizleyin. Bandana desenleri için kimyasal
              temizleyici kullanmayın.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <ProductPurchase />
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h3 className="text-sm font-semibold">Ürün Bilgisi</h3>
            <p className="mt-2 text-sm text-neutral-600">
              {product.name} koleksiyonu yalnızca seçili modellerle satışta. Havale/EFT
              ile güvenli ödeme ve hızlı bildirim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
