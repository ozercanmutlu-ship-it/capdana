import Link from "next/link";

const links = [
  { href: "/kargo-ve-iade", label: "Kargo & İade" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-neutral-900">Sente Wear</p>
          <p className="mt-2 max-w-sm text-xs text-neutral-500">
            Premium streetwear çizgisiyle tek ürün odağında zamansız bir koleksiyon.
          </p>
        </div>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-neutral-400">© 2026 Sente Wear</p>
      </div>
    </footer>
  );
};
