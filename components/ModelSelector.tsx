"use client";

import { product } from "@/lib/products";

type ModelSelectorProps = {
  selectedModelId: string | null;
  onSelect: (modelId: string) => void;
};

export const ModelSelector = ({ selectedModelId, onSelect }: ModelSelectorProps) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-neutral-700">Model Seçimi</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {product.models.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelect(model.id)}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-500"
              }`}
            >
              {model.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
