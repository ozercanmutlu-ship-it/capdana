"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Rarity } from "@/lib/rarity";
import { rarityOrder } from "@/lib/rarity";
import { siteConfig } from "@/lib/site";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RarityBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ToastProvider";
import { triggerFlyToCartFrom } from "@/lib/flyToCart";
import { cx } from "@/lib/cn";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Capdana3D } from "@/components/Capdana3D";
import { useTranslations, useLocale } from "next-intl";

const placeholderImage = "/images/placeholder.svg";

const getParamId = (value: string | null, prefix: string, max: number) => {
  if (!value) return null;
  const normalized = value.padStart(2, "0");
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric < 1 || numeric > max) return null;
  return `${prefix}-${normalized}`;
};

export const CapdanaBuilder = ({ customPrice, fronts, bandanas }: { customPrice: number, fronts: any[], bandanas: any[] }) => {
  const t = useTranslations('Builder');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const frontParam = searchParams?.get("front");
  const bandanaParam = searchParams?.get("bandana");

  const initialFrontId = getParamId(frontParam, "front", fronts.length);
  const initialBandanaId = getParamId(bandanaParam, "bandana", bandanas.length);

  const [frontId, setFrontId] = useState<string | null>(initialFrontId);
  const [bandanaId, setBandanaId] = useState<string | null>(initialBandanaId);

  const frontById = useMemo(() => new Map(fronts.map(f => [f.id, f])), [fronts]);
  const bandanaById = useMemo(() => new Map(bandanas.map(b => [b.id, b])), [bandanas]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<"ALL" | Rarity>("ALL");
  const [previewMode, setPreviewMode] = useState<"2D" | "3D">("2D");
  const [viewAngle, setViewAngle] = useState<"front" | "right" | "back" | "left" | "top" | "360">("360");
  const { show } = useToast();

  const bandana = bandanaId ? bandanaById.get(bandanaId) : null;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const originalColor = "#FF4D4D";
    const originalGlow = "rgba(255, 77, 77, 0.22)";

    if (bandana?.color) {
      root.style.setProperty("--accent-color", bandana.color);
      const hex = bandana.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.15)`);
    } else {
      root.style.setProperty("--accent-color", originalColor);
      root.style.setProperty("--accent-glow", originalGlow);
    }

    return () => {
      root.style.setProperty("--accent-color", originalColor);
      root.style.setProperty("--accent-glow", originalGlow);
    };
  }, [bandana]);

  const step = !frontId ? 1 : !bandanaId ? 2 : 3;
  const isComplete = Boolean(frontId && bandanaId);
  const progressStep = hasAdded ? 4 : step;

  const front = frontId ? frontById.get(frontId) : null;
  // Duplicate definition was around here, removed in replacement.


  const bandanaOptions = useMemo(() => {
    const filtered =
      rarityFilter === "ALL"
        ? bandanas
        : bandanas.filter((item) => item.rarity === rarityFilter);
    return [...filtered].sort((a, b) => {
      const rarityDiff = rarityOrder[b.rarity as Rarity] - rarityOrder[a.rarity as Rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return a.id.localeCompare(b.id);
    });
  }, [rarityFilter]);

  const shareUrl = useMemo(() => {
    if (!frontId || !bandanaId) return `${siteConfig.url}/${locale}/build`;
    const frontNumber = frontId.replace("front-", "");
    const bandanaNumber = bandanaId.replace("bandana-", "");
    return `${siteConfig.url}/${locale}/build?front=${frontNumber}&bandana=${bandanaNumber}`;
  }, [frontId, bandanaId, locale]);

  const handleAddToCart = () => {
    if (!frontId || !bandanaId) {
      setMessage(t('error_select'));
      return;
    }
    addItem({
      id: `custom-${frontId}-${bandanaId}`,
      type: "custom",
      name: t('custom_design') + " Capdana",
      price: customPrice,
      quantity: 1,
      frontId,
      bandanaId,
    });
    setMessage(t('added_to_cart'));
    setHasAdded(true);
    show(tc('added_toast'), t('custom_design') + " Capdana");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const whatsappShare = useMemo(() => {
    const messageText = t('share_message', { url: shareUrl });
    return `https://wa.me/?text=${encodeURIComponent(messageText)}`;
  }, [shareUrl, t]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start" data-product-root data-builder-root>
      {/* Left Column: Title & Preview (Sticky) */}
      <div className="space-y-6 lg:sticky lg:top-24 z-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{tc('nav.builder')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">{t('title')}</h1>
          <p className="mt-3 text-sm text-muted">{t('subtitle')}</p>
          <p className="mt-2 text-xs text-muted">{t('drop_info')}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted">
          {[t('step_front'), t('step_bandana'), t('step_preview'), t('step_cart')].map((label, index) => {
            const current = index + 1 <= progressStep;
            return (
              <span
                key={label}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2",
                  current ? "border-[var(--accent-color)] text-text" : "border-text/10"
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
                  {tc('step', { number: index + 1 })}
                </span>
                <span className="text-xs text-muted">{label}</span>
                <span className={cx("h-[10px] w-[6px] rounded-full bg-red/60", current && "drill-caret")} />
              </span>
            );
          })}
        </div>

        {/* The sticky preview container */}
        <Card className="space-y-4 p-6 shadow-xl relative z-20 sticky top-4 lg:static">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text">{t('step_preview')}</p>
            <div className="flex rounded-full border border-text/10 bg-bg p-1">
              {(["2D", "3D"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setPreviewMode(m);
                    if (m === "3D") setViewAngle("360");
                  }}
                  className={cx(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition",
                    previewMode === m ? "bg-[var(--accent-color)] text-black shadow-sm" : "text-muted hover:text-text"
                  )}
                >
                  {m === "3D" ? "360°" : m}
                </button>
              ))}
            </div>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg border border-text/5 ring-1 ring-black/5"
            data-builder-preview
          >
            {previewMode === "2D" ? (
              <>
                <ImageWithFallback
                  key={bandana?.id ?? "bandana"}
                  src={bandana?.image ?? placeholderImage}
                  alt={bandana?.name ?? "Bandana"}
                  fallbackSrc={placeholderImage}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover motion-safe:animate-[fade_0.25s_ease]"
                />
                <ImageWithFallback
                  key={front?.id ?? "front"}
                  src={front?.image ?? placeholderImage}
                  alt={front ? t('front_name', { number: front.id.replace('front-', '') }) : t('front_label')}
                  fallbackSrc={placeholderImage}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover motion-safe:animate-[fade_0.25s_ease]"
                />
              </>
            ) : (
              <div className="relative h-full w-full">
                <Capdana3D
                  accentColor={bandana?.color ?? "#FF4D4D"}
                  frontId={frontId}
                  bandanaId={bandanaId}
                  viewAngle={viewAngle}
                />
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 px-4 pointer-events-none">
                  <div className="bg-bg/60 backdrop-blur-md border border-text/10 rounded-full p-1.5 flex gap-1 pointer-events-auto shadow-lg">
                    {[
                      { id: "front", label: "Ön" },
                      { id: "right", label: "Yan" },
                      { id: "back", label: "Arka" },
                      { id: "top", label: "Üst" },
                      { id: "360", label: "360°" }
                    ].map(angle => (
                      <button
                        key={angle.id}
                        onClick={() => setViewAngle(angle.id as any)}
                        className={cx(
                          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all",
                          viewAngle === angle.id
                            ? "bg-[var(--accent-color)] text-black shadow-sm scale-105"
                            : "text-muted hover:text-text hover:bg-surface"
                        )}
                      >
                        {angle.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-sm text-center text-muted">
            {front ? t('front_name', { number: front.id.replace('front-', '') }) : t('not_selected')} •{" "}
            {bandana?.name ?? t('not_selected')}
          </div>
        </Card>
      </div>

      {/* Right Column: Scrollable Options */}
      <div className="space-y-8 flex flex-col pt-2 pb-24 lg:pb-0">
        <Card className="space-y-5 p-6 shadow-md border-text/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text">1. {t('step_front')}</p>
            <span className="text-xs text-muted">{t('options_count', { count: fronts.length })}</span>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {fronts.map((item) => {
              const selected = item.id === frontId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFrontId(item.id);
                    setMessage("");
                    setHasAdded(false);
                  }}
                  className={cx(
                    "rounded-2xl border p-4 text-left transition duration-200 motion-safe:transition-transform motion-safe:hover:-translate-y-1 hover:shadow-lg",
                    selected
                      ? "border-[var(--accent-color)] bg-[var(--accent-glow)] shadow-[0_0_20px_var(--accent-glow)] ring-2 ring-[var(--accent-color)]/50"
                      : "border-text/10 bg-surface hover:border-[var(--accent-color)]/30 hover:bg-surface/50"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg border border-text/5">
                    <ImageWithFallback
                      src={item.image}
                      alt={t('front_name', { number: item.id.replace('front-', '') })}
                      fallbackSrc={placeholderImage}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-text text-center">
                    {t('front_name', { number: item.id.replace('front-', '') })}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-5 p-6 shadow-md border-text/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text whitespace-nowrap">2. {t('step_bandana')}</p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-muted max-w-full scrollbar-hide">
              {(["ALL", "COMMON", "RARE", "LEGENDARY", "1OF1"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRarityFilter(value)}
                  className={cx(
                    "whitespace-nowrap rounded-full border px-3 py-1.5 transition font-medium",
                    rarityFilter === value
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] shadow-sm"
                      : "border-text/10 bg-surface/50 text-muted hover:border-[var(--accent-color)]/40 hover:text-text hover:bg-surface"
                  )}
                >
                  {value === "ALL" ? "All" : value}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {bandanaOptions.map((item) => {
              const selected = item.id === bandanaId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBandanaId(item.id);
                    setMessage("");
                    setHasAdded(false);
                  }}
                  className={cx(
                    "rounded-2xl border p-3 text-left transition duration-200 motion-safe:transition-transform motion-safe:hover:-translate-y-1 hover:shadow-lg",
                    selected
                      ? "border-[var(--accent-color)] bg-[var(--accent-glow)] shadow-[0_0_20px_var(--accent-glow)] ring-2 ring-[var(--accent-color)]/50"
                      : "border-text/10 bg-surface hover:border-[var(--accent-color)]/30 hover:bg-surface/50"
                  )}
                >
                  <div className={cx(
                    "relative aspect-square overflow-hidden rounded-xl bg-bg border border-text/5",
                    (item.rarity === "LEGENDARY" || item.rarity === "1OF1") && "premium-shimmer"
                  )}>
                    <div className="absolute left-2 top-2 z-10">
                      <RarityBadge rarity={item.rarity} className="scale-90 shadow-sm" />
                    </div>
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fallbackSrc={placeholderImage}
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium text-center text-text line-clamp-1" title={item.name}>{item.name}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Action Card / Checkout details */}
        <Card className="space-y-6 p-6 shadow-xl border-text/10 bg-gradient-to-br from-surface to-bg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-color)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-color)] font-semibold mb-1">
                {t('custom_design')} Capdana
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2 tracking-tight">{t('custom_design')}</h2>
              <p className="text-sm text-muted">{t('subtitle')}</p>
            </div>
            {isComplete && (
              <div className="text-left md:text-right shrink-0">
                <p className="text-xs text-muted mb-1">Total Premium Setup</p>
                <p className="text-2xl font-bold text-text tabular-nums tracking-tight">₺{customPrice.toFixed(2)}</p>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-text/10 via-text/5 to-transparent relative z-10" />

          {isComplete && (
            <div className="rounded-2xl border border-[var(--accent-color)]/40 bg-[var(--accent-glow)] px-5 py-4 text-sm text-text font-medium flex items-center gap-3 relative z-10 shadow-inner">
              <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-color)] text-bg font-bold">✓</span>
              {t('your_capdana')}
            </div>
          )}

          <div className="grid gap-4 relative z-10">
            <Button
              type="button"
              onClick={(e) => {
                triggerFlyToCartFrom(e.currentTarget);
                handleAddToCart();
              }}
              disabled={!isComplete}
              fullWidth
              size="lg"
              className={cx(
                "press-cta text-base font-bold shadow-lg transition-all",
                isComplete && "hover:shadow-[0_4px_24px_var(--accent-glow)]"
              )}
            >
              {t('add_to_cart')}
            </Button>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                onClick={handleCopyLink}
                variant="secondary"
                disabled={!isComplete}
                className="w-full justify-center"
              >
                {copied ? t('copied') : t('copy_link')}
              </Button>
              <Button
                type="button"
                onClick={() => window.open(whatsappShare, "_blank")}
                variant="whatsapp"
                disabled={!isComplete}
                className="w-full justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                {t('share_whatsapp')}
              </Button>
            </div>

            <p className="text-xs text-center text-muted mt-2">
              {t('instagram_hint')}
            </p>
          </div>
          {message && (
            <div className="rounded-lg bg-surface/80 p-3 text-center text-sm font-medium text-text border border-text/10 relative z-10">
              {message}
            </div>
          )}
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-text/10 bg-bg/95 px-4 py-3 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden relative">
        <div className="drill-eq-line absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--accent-color)]/60 to-transparent" />
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{t('custom_design')} Capdana</p>
            <p className="text-sm font-semibold text-text">{t('add_to_cart')}</p>
          </div>
          <Button
            type="button"
            onClick={(e) => {
              triggerFlyToCartFrom(e.currentTarget);
              handleAddToCart();
            }}
            disabled={!isComplete}
            size="sm"
            className="press-cta shadow-md font-medium"
          >
            {t('add_to_cart')}
          </Button>
        </div>
      </div>
    </div>
  );
};
