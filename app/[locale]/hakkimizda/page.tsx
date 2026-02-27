import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Capdana hakkında. Seçilmiş kombinler ve özel tasarım yaklaşımı.",
  openGraph: {
    title: "Hakkımızda",
    description: "Capdana hakkında. Tek ürün odaklı premium streetwear yaklaşımı.",
    url: `${siteConfig.url}/hakkimizda`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  alternates: {
    canonical: "/hakkimizda",
  },
};

export default function AboutPage() {
  return (
    <Section>
      <Container size="narrow">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Capdana</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Hakkımızda</h1>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <Card className="p-6">
            <p>
              Capdana, seçilmiş kombinler ve özel tasarım akışını tek üründe
              birleştiren bağımsız bir markadır.
            </p>
          </Card>
          <Card className="p-6">
            <p>
              Minimal form, net seçimler ve sade bir deneyim odağındayız.
              Seçilmiş Capdana ve senin tasarımın bu yaklaşımın iki yüzüdür.
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
