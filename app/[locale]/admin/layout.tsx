"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cx } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as string;
    const [pendingCount, setPendingCount] = useState(0);

    // Bekleyen community onaylarını periyodik olarak çek
    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await fetch("/api/admin/community");
                if (res.ok) {
                    const data = await res.json();
                    setPendingCount(data.pendingCount ?? 0);
                }
            } catch { }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") { router.push(`/${locale}/login`); return; }
        if (status === "authenticated" && session?.user?.role !== "ADMIN") {
            router.push(`/${locale}/hesabim`);
        }
    }, [status, session, router, locale]);

    if (status === "loading" || (status === "authenticated" && session?.user?.role !== "ADMIN")) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" />
            </div>
        );
    }

    const navItems = [
        { href: `/${locale}/admin`, label: "Siparişler", badge: null },
        { href: `/${locale}/admin/settings`, label: "Ayarlar", badge: null },
        { href: `/${locale}/admin/products`, label: "Ekipmanlar", badge: null },
        { href: `/${locale}/admin/ready-capdanas`, label: "Hazır Kombinler", badge: null },
        { href: `/${locale}/admin/community`, label: "Kombinler", badge: pendingCount > 0 ? pendingCount : null },
    ];

    return (
        <div className="min-h-screen bg-bg">
            <div className="border-b border-text/5 bg-surface/50 backdrop-blur-md sticky top-[var(--header-height,64px)] z-40">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                            <span className="text-sm font-bold tracking-[0.2em] text-[var(--accent-color)] uppercase pr-4 border-r border-text/10 hidden sm:block">
                                ADMIN
                            </span>
                            <nav className="flex items-center gap-1 min-w-max">
                                {navItems.map(item => (
                                    <Link key={item.href} href={item.href}
                                        className={cx(
                                            "px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5",
                                            pathname === item.href
                                                ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                                : "text-muted hover:text-text hover:bg-surface/50"
                                        )}
                                    >
                                        {item.label}
                                        {item.badge && (
                                            <span className="rounded-full bg-[var(--accent-color)] px-1.5 py-0.5 text-[9px] font-bold text-bg leading-none">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="hidden sm:block">
                            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: `/${locale}` })}>
                                Çıkış Yap
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main>
                {children}
            </main>
        </div>
    );
}
