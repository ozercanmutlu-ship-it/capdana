import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { createTranslator } from 'next-intl';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: 'Order' });

  return {
    title: t('title'),
    description: t('success_desc'),
  };
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: 'Order' });

  return (
    <Section className="pb-20 pt-10">
      <Container className="max-w-2xl">
        <OrderConfirmation />
      </Container>
    </Section>
  );
}
