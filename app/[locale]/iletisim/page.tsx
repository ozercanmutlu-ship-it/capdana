import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Capdana iletişim bilgileri ve destek kanalları.",
  openGraph: {
    title: "İletişim",
    description: "Capdana iletişim bilgileri ve destek kanalları.",
    url: `${siteConfig.url}/iletisim`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  alternates: {
    canonical: "/iletisim",
  },
};

export default function ContactPage() {
  return (
    <Section>
      <Container size="narrow">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">İletişim</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Bizimle İletişime Geç</h1>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <p>Sipariş ve ödeme süreçleri için bize e-posta üzerinden ulaşabilirsin.</p>
          <Card className="p-6">
            <p className="text-xs text-muted">E-posta</p>
            <p className="mt-1 text-sm font-medium text-text">{siteConfig.email}</p>
            <p className="mt-4 text-xs text-muted">
              Telefon bilgisi yakında paylaşılacaktır.
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
