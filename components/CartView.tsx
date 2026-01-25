"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { modelById, product } from "@/lib/products";
import { useCart } from "./CartProvider";
import { QuantitySelector } from "./QuantitySelector";
import { PaymentModal } from "./PaymentModal";

export const CartView = () => {
  const { items, updateItemQuantity, removeItem, totalQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = totalQuantity * product.price;

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        label: modelById.get(item.modelId)?.label ?? item.modelId,
      })),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-200 p-8 text-center">
        <p className="text-sm text-neutral-600">Sepetin şu an boş.</p>
        <Link
          href="/urun/bandana-sapka"
          className="mt-4 inline-flex rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium text-white"
        >
          Ürüne Git
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.modelId}`}
            className="rounded-3xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{product.name}</p>
                <p className="text-xs text-neutral-500">{item.label}</p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId, item.modelId)}
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                Kaldır
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <QuantitySelector
                quantity={item.quantity}
                onChange={(value) =>
                  updateItemQuantity(item.productId, item.modelId, value)
                }
              />
              <p className="text-sm font-medium text-neutral-900">
                {formatPrice(item.quantity * product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold">Özet</h3>
        <div className="mt-4 space-y-2 text-sm text-neutral-600">
          <div className="flex items-center justify-between">
            <span>Ürün</span>
            <span>{product.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Toplam Adet</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Toplam Tutar</span>
            <span className="font-semibold text-neutral-900">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Ödemeye Geç
        </button>
        <p className="mt-4 text-xs text-neutral-500">
          Ödeme yalnızca Havale/EFT ile alınır. Ödemeden sonra bilgileri paylaş.
        </p>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
      />
    </div>
  );
};
