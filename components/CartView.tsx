"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/format";
import { bandanaById, frontById, readyBySlug } from "@/lib/capdana";
import { useCart } from "./CartProvider";
import { QuantitySelector } from "./QuantitySelector";
import { PaymentModal } from "./PaymentModal";
import { Button, ButtonLink } from "./ui/Button";
import { Card } from "./ui/Card";
import { RarityBadge } from "./ui/Badge";
import { cx } from "@/lib/cn";
import { CartItemThumbnail } from "@/components/CartItemThumbnail";
import { useTranslations, useLocale } from "next-intl";

export const CartView = () => {
  const t = useTranslations('Cart');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const { items, updateItemQuantity, removeItem, totalQuantity, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        frontLabel: item.frontId ? frontById.get(item.frontId)?.name : undefined,
        bandanaLabel: item.bandanaId ? bandanaById.get(item.bandanaId)?.name : undefined,
        bandanaRarity: item.bandanaId ? bandanaById.get(item.bandanaId)?.rarity : undefined,
        readyRarity: item.slug ? readyBySlug.get(item.slug)?.rarity : undefined,
        frontSrc: item.frontId ? frontById.get(item.frontId)?.image : undefined,
        bandanaSrc: item.bandanaId ? bandanaById.get(item.bandanaId)?.image : undefined,
        readySrc: item.image ?? (item.slug ? readyBySlug.get(item.slug)?.image : undefined),
      })),
    [items]
  );

  const [preview, setPreview] = useState<{
    id: string;
    type: "ready" | "custom";
    alt: string;
    readySrc?: string;
    frontSrc?: string;
    bandanaSrc?: string;
    rect: { top: number; left: number; right: number; bottom: number; width: number; height: number };
    isMobile: boolean;
  } | null>(null);

  const canHover = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (!preview) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [preview]);

  const openPreview = (
    item: (typeof cartItems)[number],
    target: HTMLElement,
    mode: "hover" | "tap"
  ) => {
    const r = target.getBoundingClientRect();
    setPreview({
      id: item.id,
      type: item.type,
      alt: item.name,
      readySrc: item.readySrc,
      frontSrc: item.frontSrc,
      bandanaSrc: item.bandanaSrc,
      rect: {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      },
      isMobile: mode === "tap",
    });
  };

  if (items.length === 0) {
    return (
      <Card className="border-dashed p-8 text-center">
        <p className="text-sm text-muted">{t('empty')}</p>
        <div className="mt-4 inline-flex">
          <ButtonLink href={`/${locale}/hazir-capdanalar`} size="sm">
            {tc('nav.collection')}
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex items-start gap-4">
              <button
                type="button"
                className="shrink-0"
                aria-label={t('preview_zoom')}
                onMouseEnter={(e) => {
                  if (!canHover) return;
                  openPreview(item, e.currentTarget, "hover");
                }}
                onMouseLeave={() => {
                  if (!canHover) return;
                  setPreview(null);
                }}
                onFocus={(e) => {
                  if (!canHover) return;
                  openPreview(item, e.currentTarget, "hover");
                }}
                onBlur={() => {
                  if (!canHover) return;
                  setPreview(null);
                }}
                onClick={(e) => {
                  if (preview?.id === item.id) {
                    setPreview(null);
                    return;
                  }
                  openPreview(item, e.currentTarget, "tap");
                }}
              >
                <CartItemThumbnail
                  type={item.type}
                  alt={item.name}
                  readySrc={item.readySrc}
                  frontSrc={item.frontSrc}
                  bandanaSrc={item.bandanaSrc}
                  sizeClassName="h-16 w-16 md:h-[88px] md:w-[88px]"
                  sizes="(min-width: 768px) 88px, 64px"
                />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.type === "ready" ? tc('nav.collection') : t('custom_design')}
                    </p>
                    {item.type === "custom" && (
                      <p className="mt-1 text-xs text-muted">
                        {item.frontLabel} • {item.bandanaLabel}
                      </p>
                    )}
                    <div className="mt-2">
                      {item.type === "ready" && item.readyRarity ? (
                        <RarityBadge rarity={item.readyRarity} />
                      ) : null}
                      {item.type === "custom" && item.bandanaRarity ? (
                        <RarityBadge rarity={item.bandanaRarity} />
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-xs text-muted transition duration-200 hover:text-neon"
                  >
                    {t('remove')}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(value) => updateItemQuantity(item.id, value)}
                  />
                  <p className="text-sm font-bold text-red tabular-nums price-reveal">
                    {formatPrice(item.quantity * item.price, locale)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text">{t('order_summary')}</h3>
        <div className="mt-4 space-y-2 text-sm text-muted">
          <div className="flex items-center justify-between">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(totalAmount, locale)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{t('items_count')}</span>
            <span>{totalQuantity}</span>
          </div>
          <div
            key={totalAmount}
            className={cx(
              "flex items-center justify-between rounded-xl px-3 py-2",
              "cart-total-glow cart-total-pulse"
            )}
          >
            <span>{t('total')}</span>
            <span className="text-2xl font-bold text-red tabular-nums price-reveal">
              {formatPrice(totalAmount, locale)}
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button type="button" onClick={() => setIsModalOpen(true)} fullWidth>
            {t('checkout_button')}
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted">
          {t('payment_info')}
        </p>
      </Card>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
        onComplete={() => {
          clearCart();
          setIsModalOpen(false);
        }}
      />
      {preview
        ? createPortal(
          preview.isMobile ? (
            <div className="fixed inset-0 z-[500]">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setPreview(null)}
                role="presentation"
              />
              <div className="relative flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-text/10 bg-bg/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
                      {t('preview_label')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-text/10 bg-bg/40 text-text"
                      aria-label={t('close')}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-4">
                    <CartItemThumbnail
                      type={preview.type}
                      alt={preview.alt}
                      readySrc={preview.readySrc}
                      frontSrc={preview.frontSrc}
                      bandanaSrc={preview.bandanaSrc}
                      sizeClassName="mx-auto h-64 w-64"
                      sizes="256px"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            (() => {
              const previewW = 300;
              const previewH = 300;
              const gutter = 12;
              const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
              const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
              const placeRight = preview.rect.right + gutter + previewW <= viewportW;
              const left = placeRight
                ? preview.rect.right + gutter
                : Math.max(gutter, preview.rect.left - gutter - previewW);
              const top = Math.min(
                Math.max(gutter, preview.rect.top - 8),
                Math.max(gutter, viewportH - previewH - gutter)
              );
              return (
                <div
                  className={cx(
                    "fixed z-[500] pointer-events-none",
                    "opacity-0 motion-safe:transition motion-safe:duration-150 motion-safe:ease-out",
                    "motion-safe:opacity-100 motion-safe:scale-100 motion-safe:translate-y-0",
                    "motion-reduce:transform-none"
                  )}
                  style={{ left, top }}
                >
                  <div className="pointer-events-auto overflow-hidden rounded-2xl border border-text/10 bg-bg/80 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur">
                    <CartItemThumbnail
                      type={preview.type}
                      alt={preview.alt}
                      readySrc={preview.readySrc}
                      frontSrc={preview.frontSrc}
                      bandanaSrc={preview.bandanaSrc}
                      sizeClassName="h-[300px] w-[300px]"
                      sizes="300px"
                    />
                  </div>
                </div>
              );
            })()
          ),
          document.body
        )
        : null}
    </div>
  );
};
