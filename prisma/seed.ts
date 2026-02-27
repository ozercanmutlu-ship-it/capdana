import { PrismaClient } from "@prisma/client";
import { capFronts, bandanas, readyCapdanas, READY_PRICE, CUSTOM_PRICE } from "../lib/capdana";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // SiteSettings
    await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: {},
        create: {
            id: "default",
            readyPrice: READY_PRICE,
            customPrice: CUSTOM_PRICE,
        },
    });

    // CapFront
    for (const item of capFronts) {
        await prisma.capFront.upsert({
            where: { id: item.id },
            update: {
                name: item.name,
                image: item.image,
                slug: item.slug,
            },
            create: {
                id: item.id,
                name: item.name,
                image: item.image,
                slug: item.slug,
            },
        });
    }

    // Bandana
    for (const item of bandanas) {
        await prisma.bandana.upsert({
            where: { id: item.id },
            update: {
                name: item.name,
                image: item.image,
                slug: item.slug,
                rarity: item.rarity,
                color: item.color,
            },
            create: {
                id: item.id,
                name: item.name,
                image: item.image,
                slug: item.slug,
                rarity: item.rarity,
                color: item.color,
            },
        });
    }

    // ReadyCapdana
    for (const item of readyCapdanas) {
        await prisma.readyCapdana.upsert({
            where: { id: item.id },
            update: {
                name: item.name,
                image: item.image,
                slug: item.slug,
                frontId: item.frontId,
                bandanaId: item.bandanaId,
                rarity: item.rarity,
                price: item.price ?? null,
                tags: JSON.stringify(item.tags ?? []),
            },
            create: {
                id: item.id,
                name: item.name,
                image: item.image,
                slug: item.slug,
                frontId: item.frontId,
                bandanaId: item.bandanaId,
                rarity: item.rarity,
                price: item.price ?? null,
                tags: JSON.stringify(item.tags ?? []),
            },
        });
    }

    console.log("Database seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
