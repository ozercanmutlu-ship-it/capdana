import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ReadyCapdanaDetail } from "@/components/ReadyCapdanaDetail";
import { Testimonials } from "@/components/Testimonials";
import { siteConfig } from "@/lib/site";
import { getTranslations, getLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string, slug: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const capdana = await prisma.readyCapdana.findUnique({
    where: { slug },
    include: { front: true, bandana: true }
  });
  if (!capdana) {
    return {
      title: "Capdana",
      description: "Seçilmiş Capdana komboları.",
    };
  }

  const frontLabel = capdana.front?.name ?? "Ön Panel";
  const bandanaLabel = capdana.bandana?.name ?? "Bandana";

  return {
    title: capdana.name,
    description: `${capdana.name} • ${frontLabel} + ${bandanaLabel}. Seçilmiş kombin.`,
    openGraph: {
      title: capdana.name,
      description: `${capdana.name} • ${frontLabel} + ${bandanaLabel}. Seçilmiş kombin.`,
      url: `${siteConfig.url}/urun/${capdana.slug}`,
      images: [{ url: capdana.image, width: 1200, height: 630, alt: capdana.name }],
    },
    alternates: {
      canonical: `/urun/${capdana.slug}`,
    },
  };
};

export default async function ReadyCapdanaPage({ params }: PageProps) {
  const t = await getTranslations('Common');
  const locale = await getLocale();
  const { slug } = await params;
  const capdana = await prisma.readyCapdana.findUnique({
    where: { slug },
    include: { front: true, bandana: true }
  });

  if (!capdana) return notFound();

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const readyPrice = settings?.readyPrice ?? 333;

  return (
    <Section className="pb-20 md:pb-24">
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Seçilmiş</p>
            <h1 className="mt-2 text-3xl font-semibold text-text">{capdana.name}</h1>
          </div>
          <Badge>Drop 01</Badge>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: capdana.name,
              image: [`${siteConfig.url}${capdana.image}`],
              description: `${capdana.name} • ${capdana.front?.name} + ${capdana.bandana?.name}. Seçilmiş kombin.`,
              sku: capdana.id,
              brand: {
                "@type": "Brand",
                name: siteConfig.name,
              },
              offers: {
                "@type": "Offer",
                url: `${siteConfig.url}/urun/${capdana.slug}`,
                priceCurrency: "TRY",
                price: readyPrice,
                availability: "https://schema.org/InStock",
              },
              category: capdana.rarity,
            }),
          }}
        />

        <ReadyCapdanaDetail capdana={capdana as any} readyPrice={readyPrice} />

        <div className="mt-20 flex items-center justify-between border-t border-text/5 pt-10 text-sm text-muted">
          <p>Seçilmiş kombinler düzenlenemez.</p>
          <Link href={`/${locale}/build`} className="text-text transition hover:text-neon">
            {t('nav.builder')}
          </Link>
        </div>

        <div className="mt-24">
          <div className="mb-12 border-t border-text/5 pt-16">
            <h2 className="text-2xl font-semibold text-text">Kullanıcı Deneyimleri</h2>
            <p className="mt-2 text-sm text-muted">Bu ürünü tercih edenlerin yorumları</p>
          </div>
          <Testimonials />
        </div>
      </Container>
    </Section>
  );
}
