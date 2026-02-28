import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CommunityGallery } from "@/components/CommunityGallery";
import { createTranslator } from "next-intl";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const messages = (await import(`../../../../messages/${locale}.json`)).default;
    const t = createTranslator({ locale, messages, namespace: "Community" });
    return {
        title: t("title"),
        description: t("subtitle"),
        openGraph: {
            url: `${siteConfig.url}/${locale}/sizin-kombinleriniz`,
        },
        alternates: { canonical: `/${locale}/sizin-kombinleriniz` },
    };
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = (await import(`../../../../messages/${locale}.json`)).default;
    const t = createTranslator({ locale, messages, namespace: "Community" });

    const posts = await prisma.communityPost.findMany({
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
    });

    const serialized = posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
    }));

    return (
        <Section className="py-16 md:py-24">
            <Container>
                <div className="mb-12 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)]">Community</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-text md:text-5xl">{t("title")}</h1>
                    <p className="mx-auto mt-4 max-w-md text-sm text-muted">{t("subtitle")}</p>
                </div>
                <CommunityGallery initialPosts={serialized} />
            </Container>
        </Section>
    );
}
