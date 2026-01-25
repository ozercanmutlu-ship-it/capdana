"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/koleksiyon", label: "Koleksiyon" },
  { href: "/urun/bandana-sapka", label: "Ürün" },
  { href: "/kargo-ve-iade", label: "Kargo & İade" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export const Header = () => {
  const { totalQuantity } = useCart();

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Sente Wear
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-neutral-600 hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/sepet"
          className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:border-neutral-400"
        >
          Sepet
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
            {totalQuantity}
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4 overflow-x-auto border-t border-neutral-100 px-4 py-3 text-xs md:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap text-neutral-600">
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
};
