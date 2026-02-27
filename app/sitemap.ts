import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { readyCapdanas } from "@/lib/capdana";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const locales = ['tr', 'en'];

  const routes = [
    '',
    '/hazir-capdanalar',
    '/build',
    '/siparis-onay',
    '/kargo-ve-iade',
    '/iletisim',
    '/hakkimizda',
    '/sepet',
  ];

  const localizedRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
    }))
  );

  const productRoutes = locales.flatMap((locale) =>
    readyCapdanas.map((capdana) => ({
      url: `${base}/${locale}/urun/${capdana.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...localizedRoutes, ...productRoutes];
}
