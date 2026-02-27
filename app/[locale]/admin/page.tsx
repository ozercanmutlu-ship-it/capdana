"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cx } from "@/lib/cn";

const STATUS_OPTIONS = [
    { value: "PENDING", label: "Beklemede", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
    { value: "PROCESSING", label: "Hazırlanıyor", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
    { value: "SHIPPED", label: "Kargoda", color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
    { value: "DELIVERED", label: "Teslim Edildi", color: "text-green-400 bg-green-400/10 border-green-400/30" },
    { value: "CANCELLED", label: "İptal Edildi", color: "text-red-400 bg-red-400/10 border-red-400/30" },
];

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    items: string;
    shipping: string;
    createdAt: string;
    user: { name: string | null; email: string | null };
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState("ALL");

    const fetchOrders = useCallback(() => {
        setLoading(true);
        fetch("/api/admin/orders")
            .then((r) => r.json())
            .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (session?.user?.role === "ADMIN") {
            fetchOrders();
        }
    }, [session, fetchOrders]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdating(orderId);
        await fetch(`/api/admin/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        setUpdating(null);
        fetchOrders();
    };

    const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === "PENDING").length,
        processing: orders.filter(o => o.status === "PROCESSING").length,
        shipped: orders.filter(o => o.status === "SHIPPED").length,
        revenue: orders.filter(o => o.status !== "CANCELLED").reduce((acc, o) => acc + o.totalAmount, 0),
    };

    return (
        <Section className="py-10">
            <Container className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Toplam Sipariş", value: stats.total, color: "text-text" },
                        { label: "Beklemede", value: stats.pending, color: "text-yellow-400" },
                        { label: "Hazırlanıyor", value: stats.processing, color: "text-blue-400" },
                        { label: "Toplam Ciro", value: `₺${stats.revenue.toFixed(0)}`, color: "text-[var(--accent-color)]" },
                    ].map(stat => (
                        <Card key={stat.label} className="p-5 bg-surface/50 border-text/10 space-y-1">
                            <p className="text-xs text-muted uppercase tracking-wider">{stat.label}</p>
                            <p className={cx("text-2xl font-bold", stat.color)}>{stat.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {["ALL", ...STATUS_OPTIONS.map(s => s.value)].map(val => (
                        <button
                            key={val}
                            onClick={() => setFilter(val)}
                            className={cx(
                                "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                                filter === val
                                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                    : "border-text/10 text-muted hover:border-text/30 bg-surface/40"
                            )}
                        >
                            {val === "ALL" ? "Tümü" : STATUS_OPTIONS.find(s => s.value === val)?.label ?? val}
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div className="py-20 text-center text-muted">Yükleniyor...</div>
                ) : filtered.length === 0 ? (
                    <Card className="py-16 text-center border-text/10 bg-surface/30">
                        <p className="text-3xl mb-3">📭</p>
                        <p className="text-text font-semibold">Bu filtrede sipariş yok</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((order) => {
                            const statusOpt = STATUS_OPTIONS.find(s => s.value === order.status);
                            const items = JSON.parse(order.items || "[]");
                            const shipping = JSON.parse(order.shipping || "{}");
                            return (
                                <Card key={order.id} className="p-5 border-text/10 bg-surface/50 space-y-4 group hover:border-text/20 transition">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="font-mono text-xs text-muted">#{order.id}</p>
                                                <span className={cx("text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border", statusOpt?.color)}>
                                                    {statusOpt?.label}
                                                </span>
                                            </div>

                                            <div className="mt-3">
                                                <p className="text-sm font-semibold text-text">
                                                    {shipping.fullName || order.user.name || "İsimsiz"}
                                                    <span className="text-muted font-normal ml-1">· {shipping.email || order.user.email}</span>
                                                </p>
                                                {shipping.phone && (
                                                    <p className="text-xs text-muted mt-0.5">📞 {shipping.phone}</p>
                                                )}
                                                {shipping.address && (
                                                    <p className="text-xs text-muted mt-1 leading-relaxed max-w-[500px]">📍 {shipping.address}</p>
                                                )}
                                                {shipping.note && (
                                                    <p className="text-xs text-yellow-500/80 mt-1 italic">Not: {shipping.note}</p>
                                                )}
                                            </div>

                                            <div className="mt-2 text-xs text-muted flex items-center gap-2 flex-wrap">
                                                <span>{new Date(order.createdAt).toLocaleString("tr-TR")}</span>
                                                <span>·</span>
                                                <span>{items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)} ürün</span>
                                                <span>·</span>
                                                <span className="text-text font-bold text-sm">₺{order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Status updater */}
                                        <div className="flex-shrink-0 mt-4 sm:mt-0">
                                            <select
                                                value={order.status}
                                                disabled={updating === order.id}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="rounded-xl border border-text/10 bg-bg px-3 py-2 text-xs font-semibold text-text outline-none focus:border-[var(--accent-color)] transition cursor-pointer disabled:opacity-50"
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Items preview */}
                                    <div className="pt-3 border-t border-text/5 flex flex-wrap gap-2">
                                        {items.map((item: { name?: string; frontId?: string; bandanaId?: string, quantity?: number }, i: number) => (
                                            <span key={i} className="text-[11px] bg-bg rounded-lg px-2.5 py-1.5 border border-text/10 text-muted flex items-center gap-1.5">
                                                <span className="font-semibold text-text">{item.quantity}x</span> {item.name ?? `${item.frontId} + ${item.bandanaId}`}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </Container>
        </Section>
    );
}
