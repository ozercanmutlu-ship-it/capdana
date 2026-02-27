"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

export const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();

  useEffect(() => {
    const path = search ? `${pathname}?${search}` : pathname;
    trackPageView(path);
  }, [pathname, search]);

  return <VercelAnalytics />;
};
