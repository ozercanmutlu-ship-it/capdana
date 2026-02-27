const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fronts = [
    { id: 'front-cyber', name: 'Cyber Circuit', slug: 'cyber-circuit', image: '/images/products/fronts/front-cyber.png' },
    { id: 'front-gothic', name: 'Gothic Cap', slug: 'gothic-cap', image: '/images/products/fronts/front-gothic.png' },
    { id: 'front-luxury', name: 'Luxury Gold', slug: 'luxury-gold', image: '/images/products/fronts/front-luxury.png' },
    { id: 'front-metal', name: 'Metal Emblem', slug: 'metal-emblem', image: '/images/products/fronts/front-metal.png' },
    { id: 'front-stencil', name: 'Stencil CAP', slug: 'stencil-cap', image: '/images/products/fronts/front-stencil.png' },
    { id: 'front-topo', name: 'Topo Matte', slug: 'topo-matte', image: '/images/products/fronts/front-topo.png' },
    { id: 'front-vibrant', name: '90s Vibrant', slug: '90s-vibrant', image: '/images/products/fronts/front-vibrant.png' },
];

const bandanaColors = [
    '#b536ff', '#39ff14', '#ff4d4d', '#f5f5f5', '#282828', '#0096ff', '#ffc800', '#ff3296'
];

async function main() {
    console.log('Seeding Front Panels...');
    for (const f of fronts) {
        await prisma.capFront.upsert({
            where: { id: f.id },
            update: f,
            create: f,
        });
    }

    console.log('Seeding Bandanas...');
    const patterns = ['Urban Camo', 'Neo-Paisley', 'Abstract Graffiti', 'Cyber Grid', 'Topo Lines'];
    const rarities = ['COMMON', 'RARE', 'LEGENDARY'];

    for (let i = 1; i <= 33; i++) {
        const pattern = patterns[(i - 1) % patterns.length];
        const color = bandanaColors[(i - 1) % bandanaColors.length];
        const item = {
            id: `bandana-v${i}`,
            name: `${pattern} Premium #${i}`,
            slug: `bandana-v${i}`,
            image: `/images/products/bandanas/bandana-${i}.png`,
            color: color,
            rarity: rarities[i % 3], // Cycle through rarities
        };

        await prisma.bandana.upsert({
            where: { id: item.id },
            update: item,
            create: item,
        });
    }

    console.log('Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
