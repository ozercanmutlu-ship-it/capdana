"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ReadyCapdana, bandanaById } from "@/lib/capdana";
import { Rarity } from "@/lib/rarity";
import { Card } from "@/components/ui/Card";
import { RarityBadge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { cx } from "@/lib/cn";
import { Search, Filter, SlidersHorizontal, X, ShoppingBag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";
import { triggerFlyToCartFrom } from "@/lib/flyToCart";
import { Button } from "@/components/ui/Button";

interface CollectionBrowserProps {
    products: ReadyCapdana[];
    readyPrice: number;
}

export const CollectionBrowser = ({ products, readyPrice }: CollectionBrowserProps) => {
    const t = useTranslations('Collection');
    const locale = useLocale();
    const [search, setSearch] = useState("");
    const [rarityFilter, setRarityFilter] = useState<Rarity | "ALL">("ALL");
    const [sortBy, setSortBy] = useState<"newest" | "rarity-desc" | "rarity-asc">("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { addItem } = useCart();
    const { show } = useToast();

    const handleQuickAdd = (capdana: ReadyCapdana) => {
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
        show("SEPETE EKLENDİ", "Seçilmiş Capdana");
    };

    const rarities: (Rarity | "ALL")[] = ["ALL", "COMMON", "RARE", "LEGENDARY", "1OF1"];

    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
            const matchesRarity = rarityFilter === "ALL" || p.rarity === rarityFilter;
            return matchesSearch && matchesRarity;
        });

        const rarityOrder: Record<Rarity, number> = {
            "COMMON": 0,
            "RARE": 1,
            "LEGENDARY": 2,
            "1OF1": 3
        };

        if (sortBy === "rarity-desc") {
            result.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        } else if (sortBy === "rarity-asc") {
            result.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        }

        return result;
    }, [products, search, rarityFilter, sortBy]);

    return (
        <div className="space-y-8">
            {/* Search and Filters Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface/40 border border-text/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:border-[var(--accent-color)]/50 focus:outline-none transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cx(
                            "flex items-center gap-2 px-4 py-2.5 rounded-full border border-text/10 text-xs font-semibold uppercase tracking-wider transition",
                            isFilterOpen ? "bg-text text-black" : "bg-surface/40 hover:border-text/20"
                        )}
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        {t('filter')}
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-surface/40 border border-text/10 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-text/20"
                    >
                        <option value="newest">{t('sort_newest')}</option>
                        <option value="rarity-desc">{t('sort_rarity_desc')}</option>
                        <option value="rarity-asc">{t('sort_rarity_asc')}</option>
                    </select>
                </div>
            </div>

            {/* Filter Drawer/Bar */}
            {isFilterOpen && (
                <Card className="p-6 bg-surface/20 border-dashed animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">{t('rarity_label')}</p>
                            <div className="flex flex-wrap gap-2">
                                {rarities.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRarityFilter(r)}
                                        className={cx(
                                            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition",
                                            rarityFilter === r
                                                ? "bg-[var(--accent-color)] border-[var(--accent-color)] text-black"
                                                : "border-text/10 bg-bg/40 text-muted hover:border-text/20 hover:text-text"
                                        )}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted uppercase tracking-[0.1em]">
                    {t('found_count', { count: filteredProducts.length })}
                </p>
                {(search || rarityFilter !== "ALL") && (
                    <button
                        onClick={() => { setSearch(""); setRarityFilter("ALL"); }}
                        className="text-xs text-[var(--accent-color)] hover:underline"
                    >
                        {t('clear_filters')}
                    </button>
                )}
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((capdana) => {
                        const bandana = bandanaById.get(capdana.bandanaId);
                        const accentColor = bandana?.color || "#FF4D4D";

                        return (
                            <div
                                key={capdana.id}
                                className="group relative"
                                style={{ "--card-accent": accentColor } as any}
                                data-product-root
                            >
                                <Card className="overflow-hidden p-0 group-hover:border-[var(--card-accent)]/50 transition-colors duration-300 relative h-full flex flex-col">
                                    <Link href={`/${locale}/urun/${capdana.slug}`} className="absolute inset-0 z-0" aria-label={capdana.name} />

                                    <div className="relative aspect-[4/3] bg-bg overflow-hidden" data-product-image>
                                        <ImageWithFallback
                                            src={capdana.image}
                                            alt={capdana.name}
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        />

                                        <div className="absolute left-4 top-4 flex flex-col gap-2 z-10 pointer-events-none">
                                            {capdana.rarity === "LEGENDARY" || capdana.rarity === "1OF1" ? (
                                                <div className="premium-shimmer rounded-full px-3 py-1 border border-white/10 backdrop-blur-md">
                                                    <RarityBadge rarity={capdana.rarity} className="border-0 p-0" />
                                                </div>
                                            ) : (
                                                <RarityBadge rarity={capdana.rarity} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between z-10 pointer-events-none">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-text group-hover:text-[var(--card-accent)] transition-colors">
                                                    {capdana.name}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {capdana.tags?.map(tag => (
                                                        <span key={tag} className="text-[9px] uppercase tracking-wider text-muted/60">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-text tabular-nums">
                                                    {formatPrice(capdana.price ?? readyPrice, locale)}
                                                </p>
                                                <p className="text-[9px] text-muted uppercase tracking-tighter">Dropdown 01</p>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-auto">
                                            <Link href={`/${locale}/urun/${capdana.slug}`} tabIndex={-1}>
                                                <Button type="button" size="sm" variant="secondary" fullWidth className="text-xs">
                                                    İncele
                                                </Button>
                                            </Link>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="press-cta flex items-center justify-center gap-2 text-xs"
                                                fullWidth
                                                onClick={(e) => {
                                                    triggerFlyToCartFrom(e.currentTarget);
                                                    handleQuickAdd(capdana);
                                                }}
                                            >
                                                <ShoppingBag className="h-3 w-3" />
                                                Sepete Ekle
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Card className="p-20 flex flex-col items-center justify-center text-center border-dashed">
                    <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-muted" />
                    </div>
                    <p className="text-sm text-text font-medium">{t('no_results')}</p>
                    <p className="text-xs text-muted mt-1">{t('no_results_desc')}</p>
                    <button
                        onClick={() => { setSearch(""); setRarityFilter("ALL"); }}
                        className="mt-6 text-xs text-[var(--accent-color)] hover:underline font-semibold uppercase tracking-widest"
                    >
                        {t('show_all')}
                    </button>
                </Card>
            )}
        </div>
    );
};
