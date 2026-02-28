import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { createTranslator } from 'next-intl';
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";
import { Testimonials } from "@/components/Testimonials";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: 'Hero' });

  return {
    title: t('title'),
    description: "Capdana: tek ürün, iki seçim. Seçilmiş kombolar ve senin tasarımın.",
    openGraph: {
      title: t('title'),
      description: "Capdana: tek ürün, iki seçim. Seçilmiş kombolar ve senin tasarımın.",
      url: `${siteConfig.url}/${locale}`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  const t = createTranslator({ locale, messages, namespace: 'Hero' });
  const tc = createTranslator({ locale, messages, namespace: 'Common' });
  const tt = createTranslator({ locale, messages, namespace: 'Testimonials' });

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/${locale}/hazir-capdanalar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <Section className="relative overflow-hidden bg-gradient-to-b from-[#050505] via-bg to-bg pt-16 md:pt-24 lg:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[var(--accent-color)]/10 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-60 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 70%)",
          }}
        />
        <Container>
          <div className="flex flex-col lg:grid lg:items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative space-y-8 text-center lg:pr-8 lg:text-left z-10 w-full overflow-hidden px-4 md:px-0">
              <h1 className="mx-auto lg:mx-0 max-w-xl text-5xl font-bold leading-[1.05] tracking-tight text-text sm:text-6xl md:text-7xl lg:text-[5rem] drop-shadow-sm">
                {t.rich('title', {
                  span: (chunks) => <span className="block hero-fade-up">{chunks}</span>,
                  highlight: (chunks) => <span className="block hero-fade-up text-[var(--accent-color)] capdana-highlight filter drop-shadow-[0_0_15px_var(--accent-glow)]">{chunks}</span>
                })}
              </h1>
              <p className="mx-auto lg:mx-0 max-w-lg hero-fade-up hero-delay-3 text-base text-muted md:text-lg font-medium leading-relaxed">
                {t('subtitle')}
              </p>
              <div className="mx-auto lg:mx-0 flex flex-col sm:grid max-w-xl gap-4 sm:grid-cols-2 w-full">
                <div className="hero-fade-up hero-delay-4 w-full">
                  <ButtonLink
                    href={`/${locale}/hazir-capdanalar`}
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="border-text/15 backdrop-blur-md shadow-sm w-full"
                  >
                    {t('cta_select')}
                  </ButtonLink>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted/80">{t('ready_count')}</p>
                </div>
                <div className="hero-fade-up hero-delay-4 w-full relative group/btn-wrapper">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color)]/50 opacity-0 blur transition duration-500 group-hover/btn-wrapper:opacity-60" />
                  <ButtonLink
                    href={`/${locale}/build`}
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="relative w-full"
                  >
                    <span>{t('cta_create')}</span>
                  </ButtonLink>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--accent-color)]/90">{t('builder_stats')}</p>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 flex max-w-[90vw] gap-3 overflow-x-auto pb-4 pt-1 px-1 text-[11px] font-semibold tracking-wide text-text/90 lg:justify-start mix-blend-plus-lighter scrollbar-hide snap-x">
                {[
                  t('features.drop'),
                  t('features.custom'),
                  t('features.shipping'),
                  t('features.payment')
                ].map((item) => (
                  <span
                    key={item}
                    className="snap-center whitespace-nowrap flex items-center gap-1.5 rounded-full border border-text/5 bg-surface/60 px-4 py-2 shadow-sm backdrop-blur-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] opacity-70 flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-[90%] max-w-md lg:w-full lg:max-w-none lg:pl-10 pb-8 lg:pb-0 overflow-hidden">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-surface to-bg/50 blur-xl opacity-50" />
              <div className="group drill-poster relative rounded-[32px] border border-text/10 bg-surface/80 p-3 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-bg border border-text/5">
                  <Image
                    src="/images/vitrine/capdana-anatolia.png"
                    alt="Capdana Anatolia"
                    width={640}
                    height={800}
                    priority
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                    className="h-full w-full object-cover transition duration-700 ease-out motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                  <div className="absolute left-4 lg:left-5 top-4 lg:top-5 flex flex-col gap-2.5 z-10">
                    <span className="drill-stamp w-fit rounded-full bg-black/80 backdrop-blur-md px-4 py-2 text-[10px] font-bold tracking-wider text-white shadow-lg border border-white/10">
                      FEATURED
                    </span>
                    <span className="w-fit rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold text-white border border-white/20 shadow-sm">
                      Anatolia Collection
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 border border-white/10">
                      Drop 01
                    </span>
                    <span className="font-mono text-xs font-medium text-white/60 tracking-wider">
                      CAP-444-027
                    </span>
                  </div>
                </div>
                <div className="mt-5 mb-2 px-2 flex items-center justify-between text-xs font-medium text-muted">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse" /> Live in Vitrine</span>
                  <span>Premium System</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/5 to-transparent pointer-events-none" />
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center relative z-10">
          <div className="relative mx-auto w-[90%] max-w-md lg:w-full lg:max-w-none pb-8 lg:pb-0 overflow-hidden">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-surface to-bg/50 blur-xl opacity-50" />
            <div className="group drill-poster relative rounded-[32px] border border-text/10 bg-surface/80 p-3 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-bg border border-text/5">
                <Image
                  src="/images/capdana-hero-green.jpg"
                  alt="Capdana Green Bandana Cap"
                  width={640}
                  height={800}
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                  className="h-full w-full object-cover transition duration-700 ease-out motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                <div className="absolute left-4 lg:left-5 top-4 lg:top-5 flex flex-col gap-2.5 z-10">
                  <span className="drill-stamp w-fit rounded-full bg-black/80 backdrop-blur-md px-4 py-2 text-[10px] font-bold tracking-wider text-white shadow-lg border border-white/10">
                    FEATURED
                  </span>
                  <span className="w-fit rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold text-white border border-white/20 shadow-sm">
                    Green Paisley
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 border border-white/10">
                    Drop 02
                  </span>
                  <span className="font-mono text-xs font-medium text-white/60 tracking-wider">
                    CAP-GRN-014
                  </span>
                </div>
              </div>
              <div className="mt-5 mb-2 px-2 flex items-center justify-between text-xs font-medium text-muted">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse" /> Live in Vitrine</span>
                <span>Premium System</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('builder_section.tag')}</p>
            <h2 className="text-3xl font-semibold text-text">{t('builder_section.title')}</h2>
            <p className="text-sm text-muted">
              {t('builder_section.desc')}
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 text-xs text-text sm:flex-wrap">
              {[
                t('builder_section.f1'),
                t('builder_section.f2'),
                t('builder_section.f3')
              ].map((item) => (
                <span
                  key={item}
                  className="whitespace-nowrap rounded-full border border-text/10 bg-surface/80 px-4 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
            <ButtonLink href={`/${locale}/build`} variant="secondary" size="md">
              {t('builder_section.title')}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('why_section.tag')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-text">{t('why_section.title')}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: t('why_section.item1_title'),
                text: t('why_section.item1_desc'),
                icon: "✦",
              },
              {
                title: t('why_section.item2_title'),
                text: t('why_section.item2_desc'),
                icon: "◎",
              },
              {
                title: t('why_section.item3_title'),
                text: t('why_section.item3_desc'),
                icon: "◌",
              },
            ].map((item) => (
              <Card key={item.title} className="space-y-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-text/10 bg-bg text-sm text-text">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                <p className="text-sm text-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface/20">
        <Container>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-neon">Community</p>
            <h2 className="mt-2 text-3xl font-semibold text-text md:text-4xl">{tt('title')}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted">
              {tt('subtitle')}
            </p>
          </div>
          <Testimonials />
        </Container>
      </Section>
    </div>
  );
}
