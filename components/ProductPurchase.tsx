"use client";

import { useMemo, useState } from "react";
import { product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ModelSelector } from "./ModelSelector";
import { QuantitySelector } from "./QuantitySelector";
import { useCart } from "./CartProvider";

export const ProductPurchase = () => {
  const { addItem } = useCart();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selectedModelLabel = useMemo(() => {
    if (!selectedModelId) return "";
    const model = product.models.find((item) => item.id === selectedModelId);
    return model?.label ?? "";
  }, [selectedModelId]);

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setMessage("");
  };

  const handleAddToCart = () => {
    if (!selectedModelId) {
      setMessage("Lütfen bir model seçin.");
      return;
    }
    addItem({ productId: product.id, modelId: selectedModelId, quantity });
    setMessage("Sepete eklendi.");
  };

  return (
    <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="text-sm text-neutral-500">
          Bandana detaylı premium şapka. Seçili model:{" "}
          <span className="text-neutral-900">
            {selectedModelLabel || "Henüz seçilmedi"}
          </span>
        </p>
        <p className="text-xl font-semibold text-neutral-900">{formatPrice(product.price)}</p>
      </div>
      <ModelSelector selectedModelId={selectedModelId} onSelect={handleSelectModel} />
      <div className="flex items-center justify-between">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="text-xs text-neutral-500">Tek fiyat: {formatPrice(product.price)}</span>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedModelId}
        className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        Sepete Ekle
      </button>
      {message ? <p className="text-xs text-neutral-600">{message}</p> : null}
    </div>
  );
};
