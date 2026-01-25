import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Sepet",
  description: "Seçtiğin modelleri görüntüle ve ödeme adımına geç.",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Sepet</p>
        <h1 className="mt-2 text-3xl font-semibold">Ödeme Adımı</h1>
      </div>
      <CartView />
    </div>
  );
}
