import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CapdanaBuilder } from "@/components/CapdanaBuilder";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";
import { createTranslator } from 'next-intl';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const tc = createTranslator({ locale, messages, namespace: 'Common' });
  const tb = createTranslator({ locale, messages, namespace: 'Builder' });

  return {
    title: tc('nav.builder'),
    description: tb('description_metadata'),
    openGraph: {
      title: tc('nav.builder'),
      description: tb('description_metadata'),
      url: `${siteConfig.url}/${locale}/build`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    alternates: {
      canonical: `/${locale}/build`,
    },
  };
}

export default async function BuildPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Capdana Builder",
    applicationCategory: "DesignApplication",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    description: "Kendi Capdana'nı tasarla. Ön panel ve bandana kombinasyonlarıyla binlerce farklı tarz yarat.",
  };

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const customPrice = settings?.customPrice ?? 444;

  const [fronts, bandanas] = await Promise.all([
    prisma.capFront.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.bandana.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <Section className="pb-20 md:pb-24">
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <Suspense fallback={null}>
          <CapdanaBuilder customPrice={customPrice} fronts={fronts as any} bandanas={bandanas as any} />
        </Suspense>
      </Container>
    </Section>
  );
}
