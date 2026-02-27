"use client";

import { useMemo } from "react";
import { product } from "@/lib/products";
import { ModelSelector } from "./ModelSelector";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "./ui/Button";
import { triggerFlyToCartFrom } from "@/lib/flyToCart";

type ProductPurchaseProps = {
  selectedModelId: string | null;
  onSelectModel: (modelId: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  message?: string;
};

export const ProductPurchase = ({
  selectedModelId,
  onSelectModel,
  quantity,
  onQuantityChange,
  onAddToCart,
  message,
}: ProductPurchaseProps) => {
  const selectedModelLabel = useMemo(() => {
    if (!selectedModelId) return "";
    const model = product.models.find((item) => item.id === selectedModelId);
    return model?.label ?? "";
  }, [selectedModelId]);

  return (
    <div className="space-y-6 rounded-2xl border border-text/10 bg-surface/95 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Bandana Drop</p>
        <h2 className="text-2xl font-semibold text-text">{product.name}</h2>
        <p className="text-sm text-muted">
          Bandana detaylı premium şapka. Seçili model:{" "}
          <span className="text-text">
            {selectedModelLabel || "Henüz seçilmedi"}
          </span>
        </p>
        <p className="text-sm text-muted">Fiyat sepette görünür.</p>
      </div>
      <ModelSelector selectedModelId={selectedModelId} onSelect={onSelectModel} />
      <div className="flex items-center justify-between">
        <QuantitySelector quantity={quantity} onChange={onQuantityChange} />
        <span className="text-xs text-muted">Tek fiyat</span>
      </div>
      <Button
        type="button"
        onClick={(e) => {
          triggerFlyToCartFrom(e.currentTarget);
          onAddToCart();
        }}
        disabled={!selectedModelId}
        fullWidth
        className="press-cta"
      >
        Sepete Ekle
      </Button>
      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
};
