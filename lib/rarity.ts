export type Rarity = "COMMON" | "RARE" | "LEGENDARY" | "1OF1";

export const rarityMeta: Record<
  Rarity,
  {
    labelTR: string;
    className: string;
  }
> = {
  COMMON: {
    labelTR: "Yaygin",
    className: "rarity-common",
  },
  RARE: {
    labelTR: "Nadir",
    className: "rarity-rare",
  },
  LEGENDARY: {
    labelTR: "Efsane",
    className: "rarity-legendary",
  },
  "1OF1": {
    labelTR: "1/1 Tek",
    className: "rarity-1of1",
  },
};

export const rarityOrder: Record<Rarity, number> = {
  COMMON: 0,
  RARE: 1,
  LEGENDARY: 2,
  "1OF1": 3,
};
