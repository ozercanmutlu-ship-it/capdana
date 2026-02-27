"use client";

import { useMemo, useState } from "react";
import { product } from "@/lib/products";
import { cx } from "@/lib/cn";

type ModelSelectorProps = {
  selectedModelId: string | null;
  onSelect: (modelId: string) => void;
};

export const ModelSelector = ({ selectedModelId, onSelect }: ModelSelectorProps) => {
  const [search, setSearch] = useState("");

  const filteredModels = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return product.models;
    return product.models.filter((model) =>
      model.label.toLowerCase().includes(normalized)
    );
  }, [search]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">Model Seçimi</p>
        <span className="text-xs text-muted">{filteredModels.length} model</span>
      </div>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Model ara (01, 12, 33)"
        className="w-full rounded-2xl border border-text/10 bg-bg px-4 py-3 text-sm text-text focus:border-neon/40 focus:outline-none transition duration-200"
        aria-label="Model ara"
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {filteredModels.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-text/10 px-4 py-6 text-center text-xs text-muted">
            Bu arama için model bulunamadı.
          </p>
        ) : (
          filteredModels.map((model) => {
            const isSelected = selectedModelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => onSelect(model.id)}
                className={cx(
                  "rounded-full border px-3 py-2 text-xs transition duration-200",
                  isSelected
                    ? "border-neon bg-neon text-bg font-semibold"
                    : "border-text/10 bg-surface text-text hover:border-neon/40"
                )}
              >
                {model.label}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
