import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cn";
import type { Rarity } from "@/lib/rarity";
import { rarityMeta } from "@/lib/rarity";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "muted";
};

export const Badge = ({ tone = "default", className, ...props }: BadgeProps) => {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        tone === "muted"
          ? "border-text/10 bg-bg/40 text-muted"
          : "border-text/15 bg-surface text-text",
        className
      )}
      {...props}
    />
  );
};

type RarityBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  rarity: Rarity;
};

export const RarityBadge = ({ rarity, className, ...props }: RarityBadgeProps) => {
  const meta = rarityMeta[rarity];
  return (
    <span
      title={meta.labelTR}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        meta.className,
        className
      )}
      {...props}
    >
      {rarity}
    </span>
  );
};
