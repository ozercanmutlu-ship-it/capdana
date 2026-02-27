"use client";

import Link from "next/link";
import { Container } from "./ui/Container";
import { siteConfig } from "@/lib/site";
import { useTranslations, useLocale } from "next-intl";

export const Footer = () => {
  const t = useTranslations('Footer');
  const tc = useTranslations('Common');
  const locale = useLocale();

  const links = [
    { href: "/", label: tc('nav.home') },
    { href: "/hazir-capdanalar", label: tc('nav.collection') },
    { href: "/build", label: tc('nav.builder') },
  ];

  const socialPlaceholders = ["Instagram", "TikTok", "Pinterest"];
  return (
    <footer className="border-t border-text/5 bg-surface/60">
      <Container className="grid gap-10 py-12 text-sm text-muted md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-base font-semibold text-text">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            {t('description')}
          </p>
          <p className="mt-4 text-xs text-muted">© 2026 {siteConfig.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('links_title')}</p>
          <div className="mt-4 grid gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm text-muted transition duration-200 hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('contact_title')}</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p className="text-text">{siteConfig.email}</p>
            <div className="flex flex-wrap gap-3 text-xs text-muted">
              {socialPlaceholders.map((item) => (
                <span key={item} className="rounded-full border border-text/10 px-3 py-1">
                  {item} ({t('coming_soon')})
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
