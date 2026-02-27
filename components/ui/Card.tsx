import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  hover?: boolean;
};

export const Card = ({ glow = false, hover = true, className, ...props }: CardProps) => {
  return (
    <div
      className={cx(
        "group rounded-3xl border border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 ease-out",
        hover &&
        "hover:-translate-y-1 hover:border-[var(--accent-color)]/30 hover:bg-[#0a0a0a]/80 hover:shadow-[0_10px_40px_var(--accent-glow)]",
        glow && "shadow-[0_0_30px_var(--accent-glow)] border-[var(--accent-color)]/20",
        className
      )}
      {...props}
    />
  );
};
