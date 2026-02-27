"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export const Section = ({ children, className }: SectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cx("drill-reveal py-12 md:py-16", isVisible && "drill-reveal--in", className)}
    >
      {children}
    </section>
  );
};
