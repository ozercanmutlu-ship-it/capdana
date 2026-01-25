import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Sente Wear iletişim bilgileri.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">İletişim</p>
      <h1 className="mt-2 text-3xl font-semibold">Bizimle İletişime Geç</h1>
      <div className="mt-6 space-y-4 text-sm text-neutral-600">
        <p>Sipariş ve ödeme süreçleri için bize aşağıdan ulaşabilirsin.</p>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <p className="text-xs text-neutral-500">E-posta</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">
            info@sentewear.com
          </p>
          <p className="mt-4 text-xs text-neutral-500">Telefon</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">+90 555 000 00 00</p>
        </div>
      </div>
    </div>
  );
}
