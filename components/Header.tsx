"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { cx } from "@/lib/cn";
import { ShoppingBag, User } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";

export const Header = () => {
  const t = useTranslations('Common');
  const locale = useLocale();
  const { totalQuantity } = useCart();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/hazir-capdanalar", label: t('nav.collection') },
    { href: "/build", label: t('nav.builder') },
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-text/10 bg-bg/85 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold tracking-tight text-text">
          Capdana
        </Link>
        <nav className="hidden items-center gap-10 text-sm md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(`/${locale}${link.href}`);
            return (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cx(
                  "relative text-muted/80 transition duration-200 hover:text-text",
                  "after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--accent-color)] after:transition after:duration-200",
                  "motion-safe:hover:after:scale-x-100",
                  isActive && "text-text after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink href={`/${locale}/sepet`} variant="secondary" size="sm" data-cart-target="true">
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {t('nav.cart')}
            <span className="rounded-full bg-[var(--accent-color)] px-2 py-0.5 text-[11px] font-semibold text-bg">
              {totalQuantity}
            </span>
          </ButtonLink>
          {session?.user ? (
            <Link
              href={`/${locale}/hesabim`}
              title={session.user.name ?? "Hesabım"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-color)] text-[11px] font-bold text-bg shadow-sm hover:shadow-md hover:scale-105 transition"
            >
              {session.user.name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
            </Link>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-text/10 bg-surface text-muted hover:border-[var(--accent-color)]/40 hover:text-text transition"
              title="Giriş Yap"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-text/10 bg-surface text-text md:hidden"
            aria-label={t('nav.open_menu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{t('nav.menu')}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </Container>
      <div className="border-t border-text/10 bg-bg/65">
        <div className="mx-auto max-w-6xl overflow-hidden px-4 py-2">
          <div className="drill-marquee text-[11px] uppercase tracking-[0.28em] text-muted/70 motion-reduce:animate-none">
            <span>
              {t('nav.marquee')}
            </span>
            <span>
              {t('nav.marquee')}
            </span>
          </div>
        </div>
      </div>
      <div
        className={cx(
          "fixed inset-0 z-50 flex flex-col bg-bg/95 px-6 pb-10 pt-24 transition duration-200 md:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-text/10 bg-surface text-text"
          aria-label={t('nav.close_menu')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="space-y-5 text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="block rounded-2xl border border-text/10 bg-surface px-5 py-4 text-text"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex justify-center pt-4">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-text/10 bg-surface px-5 py-4 text-sm text-muted">
          {t('nav.mobile_desc')}
        </div>
      </div>
    </header>
  );
};
