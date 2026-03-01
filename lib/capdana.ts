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
    id: "capdana-anatolia",
    name: "Anatolia Collection",
    image: "/images/vitrine/capdana-anatolia.png",
    slug: "anatolia-collection",
    frontId: "front-01",
    bandanaId: "bandana-01",
    rarity: "RARE",
    tags: ["red", "premium", "classic"],
  },
  {
    id: "capdana-green-paisley",
    name: "Green Paisley",
    image: "/images/capdana-hero-green.jpg",
    slug: "green-paisley",
    frontId: "front-02",
    bandanaId: "bandana-04",
    rarity: "COMMON",
    tags: ["green", "vibrant", "sport"],
  }
];

export const frontById = new Map(capFronts.map((item) => [item.id, item]));
export const bandanaById = new Map(bandanas.map((item) => [item.id, item]));
export const readyBySlug = new Map(readyCapdanas.map((item) => [item.slug, item]));
