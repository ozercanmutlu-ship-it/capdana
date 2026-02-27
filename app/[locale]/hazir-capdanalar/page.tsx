import type { Metadata } from "next";

import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { createTranslator } from 'next-intl';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: 'Collection' });

  return {
    title: t('title'),
    description: t('curated_desc'),
    openGraph: {
      title: t('title'),
      description: t('curated_desc'),
      url: `${siteConfig.url}/${locale}/hazir-capdanalar`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    alternates: {
      canonical: `/${locale}/hazir-capdanalar`,
    },
  };
}

export default async function ReadyCapdanasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: 'Collection' });

  const readyCapdanas = await prisma.readyCapdana.findMany();

  const itemListElement = readyCapdanas.map((capdana, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteConfig.url}/${locale}/urun/${capdana.slug}`,
  }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement,
  };

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const readyPrice = settings?.readyPrice ?? 333;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Section className="pt-14">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('tag_curated')}</p>
              <h1 className="mt-2 text-3xl font-semibold text-text">
                {t('title')}
              </h1>
              <p className="mt-3 text-sm text-muted">
                {t('curated_desc')}
              </p>
            </div>
            <Badge>Drop 01</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <CollectionBrowser products={readyCapdanas as any} readyPrice={readyPrice} />
        </Container>
      </Section>
    </div>
  );
}
