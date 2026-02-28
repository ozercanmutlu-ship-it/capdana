import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const locales = ['tr', 'en'];

  const routes = [
    '',
    '/hazir-capdanalar',
    '/build',
    '/kargo-ve-iade',
    '/iletisim',
    '/hakkimizda',
  ];

  const localizedRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
    }))
  );

  let readyCapdanas: { slug: string; updatedAt: Date }[] = [];
  try {
    readyCapdanas = await prisma.readyCapdana.findMany({
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.warn('Sitemap warning: Could not fetch from database. Falling back to static values.', error);
  }

  const productRoutes = locales.flatMap((locale) =>
    readyCapdanas.map((capdana) => ({
      url: `${base}/${locale}/urun/${capdana.slug}`,
      lastModified: capdana.updatedAt || new Date(),
    }))
  );

  return [...localizedRoutes, ...productRoutes];
}
