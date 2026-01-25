export type ProductModel = {
  id: string;
  label: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  models: ProductModel[];
};

const models: ProductModel[] = Array.from({ length: 33 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `model-${number}`,
    label: `Model ${number}`,
  };
});

export const product: Product = {
  id: "bandana-sapka",
  slug: "bandana-sapka",
  name: "Bandanalı Şapka",
  price: 333,
  models,
};

export const modelById = new Map(models.map((model) => [model.id, model]));
