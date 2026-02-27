import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductDetail } from "@/components/ProductDetail";
import { product } from "@/lib/products";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bandanalı Şapka",
  description: "Bandanalı Şapka. 33 model, tek fiyat, premium bandana detay.",
  openGraph: {
    title: "Bandanalı Şapka",
    description: "Bandanalı Şapka. 33 model, tek fiyat, premium bandana detay.",
    url: `${siteConfig.url}/urun/bandana-sapka`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: product.name }],
  },
  alternates: {
    canonical: "/urun/bandana-sapka",
  },
};

export default function ProductPage() {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: "Bandanalı şapka. 33 model, tek fiyat.",
    image: [`${siteConfig.url}${siteConfig.ogImage}`],
    brand: {
      "@type": "Brand",
      name: "Capdana",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/urun/bandana-sapka`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Section className="pb-20 md:pb-24">
        <Container>
          <Suspense fallback={null}>
            <ProductDetail />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
