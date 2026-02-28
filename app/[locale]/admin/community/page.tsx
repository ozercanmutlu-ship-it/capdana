"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/cn";
import { useToast } from "@/components/ToastProvider";

type Post = {
    id: string;
    imageUrl: string;
    caption: string | null;
    combo: string | null;
    approved: boolean;
    createdAt: string;
    user: { name: string | null; email: string | null };
};

export default function AdminCommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"PENDING" | "APPROVED">("PENDING");
    const { show } = useToast();

    const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/community");
        if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
        }
        setLoading(false);
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleApprove = async (id: string, approved: boolean) => {
        const res = await fetch(`/api/admin/community/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approved }),
        });
        if (res.ok) {
            show(approved ? "Onaylandı ✓" : "Reddedildi");
            fetchPosts();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;
        const res = await fetch(`/api/admin/community/${id}`, { method: "DELETE" });
        if (res.ok) { show("Silindi"); fetchPosts(); }
    };

    const filtered = posts.filter((p) =>
        tab === "PENDING" ? !p.approved : p.approved
    );
    const pendingCount = posts.filter((p) => !p.approved).length;

    return (
        <Section className="py-10">
            <Container className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-text">Sizin Kombinleriniz</h1>
                    <p className="text-sm text-muted">Müşteri fotoğraf gönderilerini yönet.</p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-lg bg-surface/40 p-1 border border-text/10 w-fit">
                    <button
                        onClick={() => setTab("PENDING")}
                        className={cx(
                            "px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition flex items-center gap-2",
                            tab === "PENDING" ? "bg-bg text-text shadow-sm" : "text-muted hover:text-text"
                        )}
                    >
                        Bekleyen
                        {pendingCount > 0 && (
                            <span className="rounded-full bg-[var(--accent-color)] px-1.5 py-0.5 text-[10px] font-bold text-bg">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab("APPROVED")}
                        className={cx(
                            "px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition",
                            tab === "APPROVED" ? "bg-bg text-text shadow-sm" : "text-muted hover:text-text"
                        )}
                    >
                        Onaylananlar
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center text-muted border border-dashed border-text/10 rounded-2xl">
                        Gönderi bulunamadı.
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((post) => (
                            <Card key={post.id} className="p-4 space-y-3 border-text/10 bg-surface/50">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg border border-text/5">
                                    <Image src={post.imageUrl} alt={post.combo ?? "Kombin"} fill sizes="33vw" className="object-cover" />
                                </div>
                                <div className="space-y-0.5">
                                    {post.combo && <p className="text-xs font-bold text-text">{post.combo}</p>}
                                    {post.caption && <p className="text-xs text-muted line-clamp-2">{post.caption}</p>}
                                    <p className="text-[10px] text-muted/60">{post.user.name ?? post.user.email} • {new Date(post.createdAt).toLocaleDateString("tr-TR")}</p>
                                </div>
                                <div className="flex gap-2">
                                    {!post.approved ? (
                                        <Button size="sm" fullWidth onClick={() => handleApprove(post.id, true)} className="press-cta">
                                            Onayla
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="secondary" fullWidth onClick={() => handleApprove(post.id, false)}>
                                            Yayından Kaldır
                                        </Button>
                                    )}
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 shrink-0" onClick={() => handleDelete(post.id)}>
                                        Sil
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </Section>
    );
}
