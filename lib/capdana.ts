import type { Rarity } from "@/lib/rarity";

export type CapFront = {
  id: string;
  name: string;
  image: string;
  slug: string;
};

export type Bandana = {
  id: string;
  name: string;
  image: string;
  slug: string;
  rarity: Rarity;
  color: string;
};

export type ReadyCapdana = {
  id: string;
  name: string;
  image: string;
  slug: string;
  frontId: string;
  bandanaId: string;
  rarity: Rarity;
  price?: number;
  tags?: string[];
};

export const READY_PRICE = 333;
export const CUSTOM_PRICE = 444;

export const capFronts: CapFront[] = [
  {
    id: "front-01",
    name: "Ön Panel 01",
    image: "/images/fronts/front-01.png",
    slug: "front-01",
  },
  {
    id: "front-02",
    name: "Ön Panel 02",
    image: "/images/fronts/front-02.png",
    slug: "front-02",
  },
  {
    id: "front-03",
    name: "Ön Panel 03",
    image: "/images/fronts/front-03.png",
    slug: "front-03",
  },
];

const bandanaRarityPlan: Rarity[] = [
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "LEGENDARY",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "RARE",
  "COMMON",
  "RARE",
  "COMMON",
  "COMMON",
  "LEGENDARY",
  "RARE",
  "COMMON",
  "1OF1",
];

const colorPalette = [
  "#FF4D4D", "#FF9F43", "#FBC531", "#4CD137", "#487EB0", "#00A8FF", "#9C88FF", "#E84393",
  "#FF4757", "#2F3542", "#747D8C", "#70A1FF", "#7BED9F", "#FFA502", "#1E90FF", "#A29BFE"
];

export const bandanas: Bandana[] = Array.from({ length: 33 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `bandana-${number}`,
    name: `Bandana ${number}`,
    image:
      number === "01"
        ? "/images/ready/capdana-01.jpg"
        : `/images/bandanas/bandana-${number}.png`,
    slug: `bandana-${number}`,
    rarity: bandanaRarityPlan[index] ?? "COMMON",
    color: colorPalette[index % colorPalette.length],
  };
});

export const readyCapdanas: ReadyCapdana[] = [
  {
    id: "capdana-01",
    name: "Crimson Phantom",
    image: "/images/ready/capdana-01.jpg",
    slug: "crimson-phantom",
    frontId: "front-01",
    bandanaId: "bandana-01",
    rarity: "RARE",
    tags: ["red", "stealth", "classic"],
  },
  {
    id: "capdana-02",
    name: "Midnight Drift",
    image: "/images/capdana-ready/capdana-02.png",
    slug: "midnight-drift",
    frontId: "front-01",
    bandanaId: "bandana-05",
    rarity: "RARE",
    tags: ["blue", "dark", "streetwear"],
  },
  {
    id: "capdana-03",
    name: "Urban Ghost",
    image: "/images/capdana-ready/capdana-03.png",
    slug: "urban-ghost",
    frontId: "front-02",
    bandanaId: "bandana-09",
    rarity: "COMMON",
    tags: ["white", "minimal", "essential"],
  },
  {
    id: "capdana-04",
    name: "Neon Strike",
    image: "/images/capdana-ready/capdana-04.png",
    slug: "neon-strike",
    frontId: "front-02",
    bandanaId: "bandana-14",
    rarity: "COMMON",
    tags: ["green", "vibrant", "sport"],
  },
  {
    id: "capdana-05",
    name: "Shadow Walker",
    image: "/images/capdana-ready/capdana-05.png",
    slug: "shadow-walker",
    frontId: "front-03",
    bandanaId: "bandana-18",
    rarity: "COMMON",
    tags: ["black", "stealth", "urban"],
  },
  {
    id: "capdana-06",
    name: "Sunset Rider",
    image: "/images/capdana-ready/capdana-06.png",
    slug: "sunset-rider",
    frontId: "front-03",
    bandanaId: "bandana-24",
    rarity: "COMMON",
    tags: ["orange", "warm", "vibes"],
  },
  {
    id: "capdana-07",
    name: "Oceanic Wave",
    image: "/images/capdana-ready/capdana-07.png",
    slug: "oceanic-wave",
    frontId: "front-01",
    bandanaId: "bandana-31",
    rarity: "COMMON",
    tags: ["blue", "cool", "summer"],
  },
  {
    id: "capdana-08",
    name: "Royal Guard",
    image: "/images/capdana-ready/capdana-02.png",
    slug: "royal-guard",
    frontId: "front-02",
    bandanaId: "bandana-08",
    rarity: "LEGENDARY",
    tags: ["purple", "premium", "royalty"],
  },
  {
    id: "capdana-09",
    name: "Gold Rush",
    image: "/images/capdana-ready/capdana-03.png",
    slug: "gold-rush",
    frontId: "front-03",
    bandanaId: "bandana-15",
    rarity: "LEGENDARY",
    tags: ["gold", "yellow", "luxury"],
  }
];

export const frontById = new Map(capFronts.map((item) => [item.id, item]));
export const bandanaById = new Map(bandanas.map((item) => [item.id, item]));
export const readyBySlug = new Map(readyCapdanas.map((item) => [item.slug, item]));
