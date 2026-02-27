"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/components/ToastProvider";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { RarityBadge } from "@/components/ui/Badge";
import type { Rarity } from "@/lib/rarity";

type Front = { id: string; name: string; slug: string; image: string };
type Bandana = { id: string; name: string; slug: string; image: string; color: string; rarity: Rarity };

export default function ProductsPage() {
    const [loading, setLoading] = useState(true);
    const [fronts, setFronts] = useState<Front[]>([]);
    const [bandanas, setBandanas] = useState<Bandana[]>([]);
    const [tab, setTab] = useState<"FRONTS" | "BANDANAS">("FRONTS");
    const { show } = useToast();

    // Edit/Add State
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fRes, bRes] = await Promise.all([
                fetch("/api/admin/fronts"),
                fetch("/api/admin/bandanas")
            ]);
            if (fRes.ok) setFronts(await fRes.json());
            if (bRes.ok) setBandanas(await bRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = tab === "FRONTS" ? "/api/admin/fronts" : "/api/admin/bandanas";
        const method = isAdding ? "POST" : "PATCH";
        const url = isAdding ? endpoint : `${endpoint}/${editingItem.id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingItem),
            });

            if (res.ok) {
                show("Başarılı", "Kayıt güncellendi.");
                setEditingItem(null);
                setIsAdding(false);
                fetchData();
            } else {
                show("Hata", "Kayıt işlemi başarısız.");
            }
        } catch (err) {
            show("Hata", "Bir hata oluştu.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;
        const endpoint = tab === "FRONTS" ? "/api/admin/fronts" : "/api/admin/bandanas";
        try {
            const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
            if (res.ok) {
                show("Başarılı", "Silindi.");
                fetchData();
            } else {
                show("Hata", "Silinemedi.");
            }
        } catch (e) {
            show("Hata", "Bir hata oluştu.");
        }
    };

    const openAddModal = () => {
        if (tab === "FRONTS") {
            setEditingItem({ id: `front-${fronts.length + 1}`, name: "", slug: "", image: "" });
        } else {
            setEditingItem({ id: `bandana-${bandanas.length + 1}`, name: "", slug: "", image: "", color: "#000000", rarity: "COMMON" });
        }
        setIsAdding(true);
    };

    if (loading && fronts.length === 0) {
        return (
            <div className="py-20 flex justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <Section className="py-10">
            <Container className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text">Ekipman Yönetimi</h1>
                        <p className="text-sm text-muted mt-1">Ön panelleri ve bandanaları düzenleyin.</p>
                    </div>
                    <Button onClick={openAddModal} className="press-cta shadow-md">
                        + Yeni {tab === "FRONTS" ? "Ön Panel" : "Bandana"} Ekle
                    </Button>
                </div>

                <div className="flex rounded-lg bg-surface/40 p-1 border border-text/10 inline-flex">
                    <button
                        onClick={() => setTab("FRONTS")}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition ${tab === "FRONTS" ? "bg-bg text-text shadow" : "text-muted hover:text-text"}`}
                    >
                        Ön Paneller ({fronts.length})
                    </button>
                    <button
                        onClick={() => setTab("BANDANAS")}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition ${tab === "BANDANAS" ? "bg-bg text-text shadow" : "text-muted hover:text-text"}`}
                    >
                        Bandanalar ({bandanas.length})
                    </button>
                </div>

                {tab === "FRONTS" && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {fronts.map(f => (
                            <Card key={f.id} className="p-4 border-text/10 bg-surface/50 space-y-3 group flex flex-col justify-between">
                                <div>
                                    <div className="aspect-[4/3] rounded-lg bg-bg overflow-hidden relative mb-3 border border-text/5">
                                        <ImageWithFallback src={f.image} alt={f.name} className="object-cover" sizes="25vw" />
                                    </div>
                                    <p className="font-semibold text-text text-sm">{f.name}</p>
                                    <p className="text-xs font-mono text-muted">{f.id} • {f.slug}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="secondary" onClick={() => { setEditingItem(f); setIsAdding(false); }}>Düzenle</Button>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(f.id)}>Sil</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {tab === "BANDANAS" && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {bandanas.map(b => (
                            <Card key={b.id} className="p-4 border-text/10 bg-surface/50 space-y-3 group flex flex-col justify-between">
                                <div>
                                    <div className="aspect-square rounded-lg bg-bg overflow-hidden relative mb-3 border border-text/5" style={{ borderColor: b.color }}>
                                        <div className="absolute top-2 left-2 z-10"><RarityBadge rarity={b.rarity} className="scale-75 origin-top-left" /></div>
                                        <ImageWithFallback src={b.image} alt={b.name} className="object-cover" sizes="25vw" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: b.color }} />
                                        <p className="font-semibold text-text text-sm">{b.name}</p>
                                    </div>
                                    <p className="text-xs font-mono text-muted">{b.id} • {b.slug}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="secondary" onClick={() => { setEditingItem(b); setIsAdding(false); }}>Düzenle</Button>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(b.id)}>Sil</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>

            {/* Modal for editing / adding */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <Card className="w-full max-w-lg p-6 bg-bg border-text/10 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b border-text/10 pb-4">
                            <h2 className="text-xl font-bold">{isAdding ? "Yeni Ekle" : "Düzenle"} [{tab === "FRONTS" ? "Ön Panel" : "Bandana"}]</h2>
                            <button onClick={() => setEditingItem(null)} className="text-muted hover:text-text">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">ID</label>
                                    <input required disabled={!isAdding} value={editingItem.id} onChange={e => setEditingItem({ ...editingItem, id: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-[var(--accent-color)] outline-none disabled:opacity-50" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Slug</label>
                                    <input required value={editingItem.slug} onChange={e => setEditingItem({ ...editingItem, slug: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-[var(--accent-color)] outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold">İsim</label>
                                <input required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-[var(--accent-color)] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold flex justify-between">
                                    <span>Görsel Yükle (veya URL girin)</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const toastId = show("Yükleniyor...", "Görsel Vercel Blob'a yükleniyor.");

                                            try {
                                                const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
                                                    method: "POST",
                                                    body: file,
                                                });
                                                if (res.ok) {
                                                    const blob = await res.json();
                                                    setEditingItem({ ...editingItem, image: blob.url });
                                                    show("Başarılı", "Görsel yüklendi!");
                                                } else {
                                                    show("Hata", "Yükleme başarısız oldu.");
                                                }
                                            } catch (err) {
                                                show("Hata", "Görsel yüklenirken bir hata oluştu.");
                                            }
                                        }}
                                        className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-color)]/20 file:text-[var(--accent-color)] hover:file:bg-[var(--accent-color)]/30 w-full"
                                    />
                                </div>
                                <input required value={editingItem.image} onChange={e => setEditingItem({ ...editingItem, image: e.target.value })} placeholder="/images/fronts/front-01.png" className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 mt-2 text-sm focus:border-[var(--accent-color)] outline-none text-muted" />
                            </div>

                            {tab === "BANDANAS" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold">Renk (Hex)</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={editingItem.color} onChange={e => setEditingItem({ ...editingItem, color: e.target.value })} className="h-9 w-12 rounded cursor-pointer bg-surface border border-text/10" />
                                            <input required value={editingItem.color} onChange={e => setEditingItem({ ...editingItem, color: e.target.value })} className="flex-1 bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-[var(--accent-color)] outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold">Nadirlik (Rarity)</label>
                                        <select value={editingItem.rarity} onChange={e => setEditingItem({ ...editingItem, rarity: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-[var(--accent-color)] outline-none">
                                            <option value="COMMON">Common</option>
                                            <option value="RARE">Rare</option>
                                            <option value="LEGENDARY">Legendary</option>
                                            <option value="1OF1">1 OF 1</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-text/10">
                                <Button type="button" variant="ghost" onClick={() => setEditingItem(null)}>İptal</Button>
                                <Button type="submit" className="press-cta">Kaydet</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </Section>
    );
}
