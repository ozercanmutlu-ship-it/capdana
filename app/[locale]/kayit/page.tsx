"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
    const locale = useLocale();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Bir hata oluştu.");
            setLoading(false);
            return;
        }

        // Auto login after registration
        await signIn("credentials", { email, password, redirect: false });
        router.push(`/${locale}/hesabim`);
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md space-y-6">

                <div className="text-center space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">Capdana</p>
                    <h1 className="text-3xl font-bold text-text tracking-tight">Kayıt Ol</h1>
                    <p className="text-sm text-muted">Topluluğa katıl, siparişlerini kolayca takip et.</p>
                </div>

                <Card className="p-8 space-y-6 shadow-xl border-text/10 bg-surface/80 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/5 to-transparent pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="name">Ad Soyad</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Adın Soyadın"
                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]/20 transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="email">E-posta</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ornek@email.com"
                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]/20 transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted" htmlFor="password">Şifre</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="En az 6 karakter"
                                className="w-full rounded-xl border border-text/10 bg-bg px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]/20 transition"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth size="lg" disabled={loading} className="press-cta mt-2">
                            {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
                        </Button>
                    </form>

                    <div className="relative z-10 text-center text-sm text-muted">
                        Zaten hesabın var mı?{" "}
                        <Link href={`/${locale}/login`} className="text-[var(--accent-color)] font-semibold hover:underline">
                            Giriş Yap
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
