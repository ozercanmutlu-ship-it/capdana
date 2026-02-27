"use client";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

export const QuantitySelector = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) => {
  const handleDecrease = () => onChange(Math.max(min, quantity - 1));
  const handleIncrease = () => onChange(Math.min(max, quantity + 1));

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDecrease}
        className="h-9 w-9 rounded-full border border-text/5 bg-surface text-lg text-text hover:border-neon/40 transition duration-200"
      >
        -
      </button>
      <span className="min-w-[40px] text-center text-sm font-medium text-text">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        className="h-9 w-9 rounded-full border border-text/5 bg-surface text-lg text-text hover:border-neon/40 transition duration-200"
      >
        +
      </button>
    </div>
  );
};
