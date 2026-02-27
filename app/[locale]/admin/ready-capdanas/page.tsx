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
type ReadyCapdana = {
    id: string; name: string; slug: string; price: number | null;
    frontId: string; bandanaId: string; image: string; tags: string; rarity: string;
    front?: Front; bandana?: Bandana;
};

export default function ReadyCapdanasPage() {
    const [loading, setLoading] = useState(true);
    const [capdanas, setCapdanas] = useState<ReadyCapdana[]>([]);
    const [fronts, setFronts] = useState<Front[]>([]);
    const [bandanas, setBandanas] = useState<Bandana[]>([]);
    const { show } = useToast();

    // Edit/Add State
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, fRes, bRes] = await Promise.all([
                fetch("/api/admin/ready-capdanas"),
                fetch("/api/admin/fronts"),
                fetch("/api/admin/bandanas")
            ]);
            if (cRes.ok) setCapdanas(await cRes.json());
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
        const method = isAdding ? "POST" : "PATCH";
        const url = isAdding ? "/api/admin/ready-capdanas" : `/api/admin/ready-capdanas/${editingItem.id}`;

        // ensure price is null if empty string, or parse float
        const payload = { ...editingItem };
        if (payload.price === "") payload.price = null;
        else if (payload.price !== null) payload.price = parseFloat(payload.price);

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
        if (!window.confirm("Bu Hazır Kombini silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`/api/admin/ready-capdanas/${id}`, { method: "DELETE" });
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
        setEditingItem({
            id: `ready-${capdanas.length + 1}`, name: "", slug: "", price: "",
            frontId: fronts.length > 0 ? fronts[0].id : "",
            bandanaId: bandanas.length > 0 ? bandanas[0].id : "",
            image: "", tags: "", rarity: "COMMON"
        });
        setIsAdding(true);
    };

    if (loading && capdanas.length === 0) {
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
                        <h1 className="text-3xl font-bold text-text">Hazır Kombin Yönetimi</h1>
                        <p className="text-sm text-muted mt-1">Sitede sergilenen hazır kombin capdanaları yönetin.</p>
                    </div>
                    <Button onClick={openAddModal} className="press-cta shadow-md">
                        + Yeni Hazır Kombin Ekle
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {capdanas.map(c => (
                        <Card key={c.id} className="p-4 border-text/10 bg-surface/50 space-y-3 group flex flex-col justify-between">
                            <div>
                                <div className="aspect-[4/3] rounded-lg bg-bg overflow-hidden relative mb-3 border border-text/5">
                                    <div className="absolute top-2 left-2 z-10">
                                        <RarityBadge rarity={c.rarity as Rarity} className="scale-75 origin-top-left" />
                                    </div>
                                    <ImageWithFallback src={c.image} alt={c.name} className="object-cover" sizes="25vw" />
                                </div>
                                <p className="font-semibold text-text text-sm">{c.name}</p>
                                <p className="text-xs font-mono text-muted">{c.id} • {c.slug}</p>
                                {c.price ? (
                                    <p className="text-xs font-bold text-[var(--accent-color)] mt-1">{c.price} ₺ (Özel Fiyat)</p>
                                ) : (
                                    <p className="text-xs text-muted mt-1">Genel Fiyat (Ayarlardan)</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={() => { setEditingItem(c); setIsAdding(false); }}>Düzenle</Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(c.id)}>Sil</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </Container>

            {/* Modal for editing / adding */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <Card className="w-full max-w-lg p-6 bg-bg border-text/10 shadow-2xl space-y-6 my-8">
                        <div className="flex justify-between items-center border-b border-text/10 pb-4">
                            <h2 className="text-xl font-bold">{isAdding ? "Yeni Ekle" : "Düzenle"} [Hazır Kombin]</h2>
                            <button onClick={() => setEditingItem(null)} className="text-muted hover:text-text">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">ID</label>
                                    <input required disabled={!isAdding} value={editingItem.id} onChange={e => setEditingItem({ ...editingItem, id: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none disabled:opacity-50" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Slug (URL)</label>
                                    <input required value={editingItem.slug} onChange={e => setEditingItem({ ...editingItem, slug: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold">İsim</label>
                                <input required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Özel Fiyat (₺)</label>
                                    <input type="number" step="0.01" value={editingItem.price === null ? "" : editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: e.target.value })} placeholder="Boş bırakırsanız genel fiyat" className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Etiketler (Tags)</label>
                                    <input value={editingItem.tags || ""} onChange={e => setEditingItem({ ...editingItem, tags: e.target.value })} placeholder="Örn: Yeni, Trend" className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Nadirlik (Rarity)</label>
                                <select value={editingItem.rarity || "COMMON"} onChange={e => setEditingItem({ ...editingItem, rarity: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none">
                                    <option value="COMMON">Common</option>
                                    <option value="RARE">Rare</option>
                                    <option value="LEGENDARY">Legendary</option>
                                    <option value="1OF1">1 OF 1</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Ön Panel</label>
                                <select required value={editingItem.frontId} onChange={e => setEditingItem({ ...editingItem, frontId: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none">
                                    <option value="" disabled>Seçiniz</option>
                                    {fronts.map(f => <option key={f.id} value={f.id}>{f.name} ({f.id})</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Bandana</label>
                                <select required value={editingItem.bandanaId} onChange={e => setEditingItem({ ...editingItem, bandanaId: e.target.value })} className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none">
                                    <option value="" disabled>Seçiniz</option>
                                    {bandanas.map(b => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Görsel URL (Ana)</label>
                                <input required value={editingItem.image} onChange={e => setEditingItem({ ...editingItem, image: e.target.value })} placeholder="/images/ready/ornek.png" className="w-full bg-surface border border-text/10 rounded-lg px-3 py-2 text-sm focus:border-neon outline-none" />
                            </div>

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
