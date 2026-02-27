"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cx } from "@/lib/cn";
import { Package, Settings, LogOut } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Beklemede", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
    PROCESSING: { label: "Hazırlanıyor", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
    SHIPPED: { label: "Kargoda", color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
    DELIVERED: { label: "Teslim Edildi", color: "text-green-400 bg-green-400/10 border-green-400/30" },
    CANCELLED: { label: "İptal Edildi", color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    items: string;
    createdAt: string;
}

export default function HesabimPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pwdStatus, setPwdStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({ type: "", msg: "" });
    const [pwdLoading, setPwdLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/${locale}/login`);
        }
    }, [status, router, locale]);

    useEffect(() => {
        if (status === "authenticated" && activeTab === "orders") {
            if (session?.user?.role === "ADMIN") {
                router.replace(`/${locale}/admin`);
                return;
            }
            fetch("/api/orders")
                .then((r) => r.json())
                .then((data) => { setOrders(data); setLoadingOrders(false); })
                .catch(() => setLoadingOrders(false));
        }
    }, [status, activeTab, session, router, locale]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" />
            </div>
        );
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdLoading(true);
        setPwdStatus({ type: "", msg: "" });

        const res = await fetch("/api/user/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await res.json();
        setPwdLoading(false);

        if (!res.ok) {
            setPwdStatus({ type: "error", msg: data.error || "Bir hata oluştu." });
        } else {
            setPwdStatus({ type: "success", msg: data.message });
            setCurrentPassword("");
            setNewPassword("");
        }
    };

    return (
        <Section className="min-h-screen py-16">
            <Container className="max-w-4xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">Capdana</p>
                        <h1 className="mt-1 text-3xl font-bold text-text">Hesabım</h1>
                    </div>
                    {session?.user?.role === "ADMIN" && (
                        <ButtonLink href={`/${locale}/admin`} variant="secondary" size="sm">
                            🛡 Yönetim Paneli
                        </ButtonLink>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    {/* Sidebar Navigation */}
                    <div className="space-y-6">
                        <Card className="p-5 border-text/10 bg-surface/50 text-center space-y-3">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-color)]/20 text-2xl font-bold text-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/50">
                                {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                                <p className="font-bold text-text">{session?.user?.name}</p>
                                <p className="text-xs text-muted truncate">{session?.user?.email}</p>
                                <span className={cx(
                                    "mt-2 inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                                    session?.user?.role === "ADMIN"
                                        ? "text-[var(--accent-color)] bg-[var(--accent-color)]/10 border-[var(--accent-color)]/30"
                                        : "text-muted bg-surface border-text/10"
                                )}>
                                    {session?.user?.role === "ADMIN" ? "Admin" : "Üye"}
                                </span>
                            </div>
                        </Card>

                        <div className="flex flex-col gap-1">
                            {session?.user?.role !== "ADMIN" && (
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={cx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                        activeTab === "orders"
                                            ? "bg-[var(--accent-color)] text-bg shadow-sm"
                                            : "text-muted hover:bg-surface hover:text-text"
                                    )}
                                >
                                    <Package className="h-4 w-4" />
                                    Siparişlerim
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={cx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                    activeTab === "settings"
                                        ? "bg-[var(--accent-color)] text-bg shadow-sm"
                                        : "text-muted hover:bg-surface hover:text-text"
                                )}
                            >
                                <Settings className="h-4 w-4" />
                                Ayarlar
                            </button>
                            <div className="my-2 border-t border-text/10" />
                            <button
                                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all text-left"
                            >
                                <LogOut className="h-4 w-4" />
                                Çıkış Yap
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="min-w-0">
                        {activeTab === "orders" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-text mb-6">Siparişlerim</h2>
                                {loadingOrders ? (
                                    <div className="py-12 text-center text-muted text-sm">Siparişler yükleniyor...</div>
                                ) : orders.length === 0 ? (
                                    <Card className="p-12 text-center border-text/10 bg-surface/30 space-y-4">
                                        <p className="text-5xl">📦</p>
                                        <p className="text-text font-semibold text-lg">Henüz siparişin yok</p>
                                        <p className="text-sm text-muted max-w-sm mx-auto">Hemen koleksiyonu keşfet ve kendi Capdana'nı oluştur. Tarzını sokağa yansıt!</p>
                                        <div className="flex justify-center gap-3 flex-wrap pt-4">
                                            <ButtonLink href={`/${locale}/hazir-capdanalar`} variant="secondary" size="sm">Koleksiyona Bak</ButtonLink>
                                            <ButtonLink href={`/${locale}/build`} size="sm">Tasarla</ButtonLink>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.map((order) => {
                                            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: "text-muted" };
                                            const items = JSON.parse(order.items || "[]");
                                            return (
                                                <Card key={order.id} className="p-5 border-text/10 bg-surface/50 space-y-3 group hover:border-[var(--accent-color)]/30 transition">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xs font-mono text-muted uppercase tracking-widest">#{order.id.slice(-8)}</p>
                                                                <span className={cx("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", statusInfo.color)}>
                                                                    {statusInfo.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm font-semibold text-text mt-1">
                                                                {items.length} ürün • <span className="text-[var(--accent-color)]">₺{order.totalAmount.toFixed(2)}</span>
                                                            </p>
                                                            <p className="text-xs text-muted mt-1">
                                                                {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-text mb-6">Ayarlar</h2>

                                <Card className="p-6 border-text/10 bg-surface/50 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-text">Şifre Değiştir</h3>
                                        <p className="text-xs text-muted mt-1">Hesap güvenliğiniz için şifrenizi düzenli olarak güncelleyin.</p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-muted">Mevcut Şifre</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-[var(--accent-color)] transition"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-muted">Yeni Şifre</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-2.5 text-sm text-text outline-none focus:border-[var(--accent-color)] transition"
                                            />
                                        </div>

                                        {pwdStatus.msg && (
                                            <div className={cx(
                                                "p-3 rounded-xl border text-sm text-center",
                                                pwdStatus.type === "success"
                                                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                                                    : "bg-red-500/10 border-red-500/30 text-red-400"
                                            )}>
                                                {pwdStatus.msg}
                                            </div>
                                        )}

                                        <Button type="submit" size="sm" disabled={pwdLoading} className="w-full">
                                            {pwdLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                                        </Button>
                                    </form>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
}

