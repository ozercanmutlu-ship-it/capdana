import type { Metadata } from "next";
import Link from "next/link";
import { product } from "@/lib/products";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Koleksiyon",
  description: "Tek ürün, 33 model. Bandanalı Şapka koleksiyonunu keşfet.",
  openGraph: {
    title: "Koleksiyon",
    description: "Tek ürün, 33 model. Bandanalı Şapka koleksiyonunu keşfet.",
    url: `${siteConfig.url}/koleksiyon`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  alternates: {
    canonical: "/koleksiyon",
  },
};

export default function KoleksiyonPage() {
  return (
    <div>
      <Section className="pt-14">
        <Container>
          <Card className="relative overflow-hidden p-8">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Koleksiyon</p>
                <h1 className="text-3xl font-semibold text-text md:text-4xl">
                  Tek Ürün, 33 Model
                </h1>
                <p className="text-sm text-muted">
                  Bandanalı Şapka koleksiyonu tek fiyatla 33 farklı model seçeneği sunar.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-text/10 bg-bg/50 p-5">
                <div>
                  <p className="text-sm font-semibold text-text">{product.name}</p>
                  <p className="text-xs text-muted">Tek fiyat • Sepette görünür</p>
                </div>
                <p className="text-xs text-muted">Drop sistemi</p>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Modeller</p>
            <Link
              href="/urun/bandana-sapka"
              className="text-sm text-muted transition duration-200 hover:text-text"
            >
              Ürüne Git
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.models.map((model) => {
              const modelParam = model.id.replace("model-", "");
              return (
                <Link
                  key={model.id}
                  href={`/urun/bandana-sapka?model=${modelParam}`}
                  className="group"
                >
                  <Card className="flex items-center justify-between p-5 transition duration-200 group-hover:border-neon/40">
                    <div>
                      <p className="text-sm font-semibold text-text">{model.label}</p>
                      <p className="text-xs text-muted">Bandana detay</p>
                    </div>
                    <span className="text-xs text-muted">Seç</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </div>
  );
}
