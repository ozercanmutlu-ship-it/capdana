import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kargo & İade",
  description: "Sente Wear kargo ve iade koşulları.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Bilgi</p>
      <h1 className="mt-2 text-3xl font-semibold">Kargo & İade</h1>
      <div className="mt-6 space-y-4 text-sm text-neutral-600">
        <p>
          Siparişler havale/EFT bildiriminin ardından 1-3 iş günü içinde kargoya
          verilir.
        </p>
        <p>
          Ürün elinize ulaştıktan sonra 7 gün içinde iade talebi
          oluşturabilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması
          gerekir.
        </p>
        <p>
          İade ve kargo süreçleriyle ilgili tüm sorularınız için iletişim
          sayfamızdan bize ulaşabilirsiniz.
        </p>
      </div>
    </div>
  );
}
