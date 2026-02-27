"use client";

import { useMemo, useState } from "react";
import { type ReadyCapdana } from "@/lib/capdana";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RarityBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ToastProvider";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { triggerFlyToCartFrom } from "@/lib/flyToCart";

type ReadyCapdanaDetailProps = {
  capdana: any;
  readyPrice: number;
};

export const ReadyCapdanaDetail = ({ capdana, readyPrice }: ReadyCapdanaDetailProps) => {
  const { addItem } = useCart();
  const { show } = useToast();
  const [message, setMessage] = useState("");

  const frontLabel = capdana.front?.name ?? "Ön Panel";
  const bandanaLabel = capdana.bandana?.name ?? "Bandana";

  const handleAddToCart = () => {
    addItem({
      id: capdana.id,
      type: "ready",
      name: capdana.name,
      price: readyPrice,
      quantity: 1,
      frontId: capdana.frontId,
      bandanaId: capdana.bandanaId,
      image: capdana.image,
      slug: capdana.slug,
    });
    setMessage("Sepete eklendi.");
    show("SEPETE EKLENDİ", "Seçilmiş Capdana");
  };

  const configuration = useMemo(
    () => `${frontLabel} + ${bandanaLabel}`,
    [frontLabel, bandanaLabel]
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]" data-product-root>
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-[4/3] bg-bg" data-product-image>
          <ImageWithFallback
            src={capdana.image}
            alt={capdana.name}
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </Card>
      <Card className="space-y-5 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Seçilmiş Capdana</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-text">{capdana.name}</h2>
            <RarityBadge rarity={capdana.rarity} />
          </div>
          <p className="mt-2 text-sm text-muted">{configuration}</p>
          <p className="mt-4 text-sm text-muted">Drop sistemi ile seçili kombin.</p>
        </div>
        <div className="space-y-2 text-sm text-muted">
          <p>Seçilmiş kombin. Düzenlenemez.</p>
          <p>Havale/EFT ile ödeme.</p>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            triggerFlyToCartFrom(e.currentTarget);
            handleAddToCart();
          }}
          fullWidth
          className="press-cta"
        >
          Sepete Ekle
        </Button>
        {message ? <p className="text-xs text-muted">{message}</p> : null}
      </Card>
    </div>
  );
};
