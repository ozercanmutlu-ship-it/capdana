import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kargo & İade",
  description: "Capdana kargo ve iade koşulları. 1–3 iş günü kargo, 7 gün iade.",
  openGraph: {
    title: "Kargo & İade",
    description: "1–3 iş günü kargo, 7 gün iade koşulları.",
    url: `${siteConfig.url}/kargo-ve-iade`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  alternates: {
    canonical: "/kargo-ve-iade",
  },
};

export default function ShippingPage() {
  return (
    <Section>
      <Container size="narrow">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Bilgi</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Kargo & İade</h1>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <Card className="p-6">
            <p>
              Siparişler, havale/EFT bildiriminin ardından 1–3 iş günü içinde kargoya
              teslim edilir.
            </p>
          </Card>
          <Card className="p-6">
            <p>
              Ürün elinize ulaştıktan sonra 7 gün içinde iade talebi oluşturabilirsiniz.
              Ürün kullanılmamış ve orijinal ambalajında olmalıdır.
            </p>
          </Card>
          <Card className="p-6">
            <p>
              Kargo ve iade süreçleriyle ilgili sorular için iletişim sayfamızdan
              bize yazabilirsiniz.
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
