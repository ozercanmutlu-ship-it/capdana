"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchase } from "@/components/ProductPurchase";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/cn";

const whatsappNumber = "905316102817";

const AccordionItem = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="w-full rounded-2xl border border-text/10 bg-surface/80 px-5 py-4 text-left transition duration-200 hover:border-neon/40"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-text">{title}</span>
        <span className="text-lg text-muted">{open ? "−" : "+"}</span>
      </div>
      <div className={cx("mt-3 text-sm text-muted", open ? "block" : "hidden")}>
        {children}
      </div>
    </button>
  );
};

export const ProductDetail = () => {
  const searchParams = useSearchParams();
  const modelParam = searchParams?.get("model") ?? "";
  const normalized = modelParam.padStart(2, "0");
  const candidateModelId = `model-${normalized}`;
  const initialModelId = product.models.find((item) => item.id === candidateModelId)
    ? candidateModelId
    : null;
  const key = modelParam || "default";

  return <ProductDetailContent key={key} initialModelId={initialModelId} />;
};

const ProductDetailContent = ({
  initialModelId,
}: {
  initialModelId: string | null;
}) => {
  const { addItem } = useCart();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(
    initialModelId
  );
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selectedModelLabel = useMemo(() => {
    if (!selectedModelId) return "";
    const model = product.models.find((item) => item.id === selectedModelId);
    return model?.label ?? "";
  }, [selectedModelId]);

  const handleAddToCart = () => {
    if (!selectedModelId) {
      setMessage("Lütfen önce bir model seçin.");
      return;
    }
    addItem({
      id: `legacy-${selectedModelId}`,
      type: "ready",
      name: product.name,
      price: product.price,
      quantity,
    });
    setMessage("Sepete eklendi.");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-8">
        <ProductGallery selectedModelId={selectedModelId} />
        <Card className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Ürün Detayları</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>Premium pamuklu bandana detay</li>
            <li>Ayarlanabilir arka bant</li>
            <li>Günlük kullanım için hafif yapı</li>
            <li>Tek fiyat, 33 farklı model seçeneği</li>
          </ul>
        </Card>
        <div className="space-y-3">
          <AccordionItem title="Kargo & İade">
            Siparişler, havale/EFT bildiriminin ardından 1–3 iş günü içinde
            kargoya teslim edilir. Ürünü 7 gün içinde, kullanılmamış ve orijinal
            ambalajında iade edebilirsin.
          </AccordionItem>
          <AccordionItem title="Bakım & Bilgi">
            Düşük ısıda temizleyin. Bandana desenlerinin uzun ömürlü kalması için
            kimyasal temizleyici kullanmayın.
          </AccordionItem>
        </div>
      </div>
      <div className="space-y-6">
        <ProductPurchase
          selectedModelId={selectedModelId}
          onSelectModel={(modelId) => {
            setSelectedModelId(modelId);
            setMessage("");
          }}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          message={message}
        />
        <Card className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Havale/EFT Akışı
          </p>
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-neon/70" />
              <p>Modelini seç, sepete ekle ve ödeme adımına geç.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-neon/70" />
              <p>Havale/EFT açıklamasına sipariş numaranı ekle.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-neon/70" />
              <p>Ödeme sonrası WhatsApp üzerinden hızlı bildirim yap.</p>
            </div>
          </div>
          <ButtonLink
            href={`https://wa.me/${whatsappNumber}`}
            variant="whatsapp"
            size="md"
            fullWidth
          >
            WhatsApp ile Bildir
          </ButtonLink>
        </Card>
        <Card className="space-y-2 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Ürün Bilgisi</p>
          <p className="text-sm text-muted">
            {product.name} yalnızca seçili modellerle satışta. Havale/EFT ile
            güvenli ödeme ve hızlı bildirim süreci.
          </p>
        </Card>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-text/10 bg-bg/95 px-4 py-3 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">
              {selectedModelLabel ? selectedModelLabel : "Model seçiniz"}
            </p>
            <p className="text-sm font-semibold text-text">Fiyat sepette</p>
          </div>
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedModelId}
            size="md"
          >
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};
