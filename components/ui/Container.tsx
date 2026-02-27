import type { ReactNode } from "react";
import { cx } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
  className?: string;
};

const sizeMap = {
  default: "max-w-6xl",
  narrow: "max-w-4xl",
  wide: "max-w-7xl",
};

export const Container = ({ children, size = "default", className }: ContainerProps) => {
  return (
    <div
      className={cx("mx-auto w-full px-4 md:px-6", sizeMap[size], className)}
    >
      {children}
    </div>
  );
};
