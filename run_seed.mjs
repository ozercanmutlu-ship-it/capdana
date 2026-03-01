import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding ready capdanas...");

    // Temizle
    await prisma.readyCapdana.deleteMany();
    console.log("Eski ready capdanalar temizlendi.");

    // Yeni 2 modeli ekle
    await prisma.readyCapdana.create({
        data: {
            id: "capdana-anatolia",
            name: "Anatolia Collection",
            image: "/images/vitrine/capdana-anatolia.png",
            slug: "anatolia-collection",
            frontId: "front-01",
            bandanaId: "bandana-01",
            rarity: "RARE",
            tags: JSON.stringify(["red", "premium", "classic"]),
        }
    });

    await prisma.readyCapdana.create({
        data: {
            id: "capdana-green-paisley",
            name: "Green Paisley",
            image: "/images/capdana-hero-green.jpg",
            slug: "green-paisley",
            frontId: "front-02",
            bandanaId: "bandana-04",
            rarity: "COMMON",
            tags: JSON.stringify(["green", "vibrant", "sport"]),
        }
    });

    console.log("Yeni 2 model eklendi.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
