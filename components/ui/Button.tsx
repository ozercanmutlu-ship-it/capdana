import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cx } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

type ButtonLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children"> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3 text-base",
};

const baseOuter =
  "group relative isolate inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-xl active:scale-[0.97]";

const baseInner =
  "relative z-10 w-full h-full inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-300";

const variantOuter: Record<ButtonVariant, string> = {
  primary:
    "drill-cta overflow-hidden bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-color)]/80 shadow-[0_4px_20px_var(--accent-glow)] hover:shadow-[0_8px_30px_var(--accent-glow)] hover:-translate-y-1 ring-1 ring-white/10",
  secondary: "border border-text/15 bg-surface/60 backdrop-blur-md hover:border-text/40 hover:bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5",
  ghost: "border border-transparent bg-transparent hover:bg-text/5 hover:text-text hover:shadow-sm",
  whatsapp:
    "overflow-hidden bg-gradient-to-tr from-[#16a34a] to-[#22c55e] shadow-[0_4px_20px_rgba(22,163,74,0.3)] hover:shadow-[0_8px_30px_rgba(22,163,74,0.4)] hover:-translate-y-1 ring-1 ring-white/10",
};

const variantInner: Record<ButtonVariant, string> = {
  primary: "bg-transparent text-bg font-bold shadow-inner",
  secondary: "bg-transparent text-text font-medium",
  ghost: "bg-transparent text-text font-medium",
  whatsapp: "bg-transparent text-white font-bold shadow-inner",
};

const wrapperPadding: Record<ButtonVariant, string> = {
  primary: "p-0",
  secondary: "p-0",
  ghost: "p-0",
  whatsapp: "p-0",
};

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cx(baseOuter, variantOuter[variant], wrapperPadding[variant], fullWidth && "w-full", className)}
      {...props}
    >
      <span
        className={cx(
          baseInner,
          variantInner[variant],
          sizeClasses[size],
          fullWidth && "w-full"
        )}
      >
        {children}
      </span>
    </button>
  );
};

export const ButtonLink = ({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link
      href={href}
      className={cx(baseOuter, variantOuter[variant], wrapperPadding[variant], fullWidth && "w-full", className)}
      {...props}
    >
      <span
        className={cx(
          baseInner,
          variantInner[variant],
          sizeClasses[size],
          fullWidth && "w-full"
        )}
      >
        {children}
      </span>
    </Link>
  );
};
