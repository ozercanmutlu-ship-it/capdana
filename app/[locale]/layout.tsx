import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "../globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { CapdanaBackground } from "@/components/CapdanaBackground";
import { siteConfig } from "@/lib/site";
import { ToastProvider } from "@/components/ToastProvider";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from '@/components/AuthProvider';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: {
      default: `${siteConfig.name} | Premium Cap & Bandana`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@capdana",
  },
  alternates: {
    canonical: "/",
  },
  keywords: [...siteConfig.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming `locale` is supported
  if (!['tr', 'en'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.ico`,
    email: siteConfig.email,
    sameAs: [
      "https://instagram.com/capdana",
      "https://twitter.com/capdana",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
    },
  };

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative overflow-x-hidden bg-bg text-text antialiased`}
      >
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <CapdanaBackground />
            <CartProvider>
              <ToastProvider>
                <div className="relative z-10">
                  <Header />
                  <main className="min-h-[70vh]">{children}</main>
                  <Footer />
                </div>
              </ToastProvider>
            </CartProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
