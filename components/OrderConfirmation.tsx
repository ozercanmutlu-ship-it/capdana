"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslations, useLocale } from "next-intl";

type OrderRecord = {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note: string;
  };
  itemSummary: string;
  totalQuantity: number;
  totalAmount: number;
};

const LAST_ORDER_KEY = "capdanaLastOrder";
const whatsappNumber = "905316102817";

export const OrderConfirmation = () => {
  const t = useTranslations('Order');
  const locale = useLocale();
  const [order] = useState<OrderRecord | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(LAST_ORDER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as OrderRecord;
    } catch {
      return null;
    }
  });

  const whatsappLink = useMemo(() => {
    if (!order) return `https://wa.me/${whatsappNumber}`;
    const message = t('whatsapp_template', {
      id: order.id,
      summary: order.itemSummary,
      quantity: order.totalQuantity,
      amount: order.totalAmount
    });
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [order, t]);

  if (!order) {
    return (
      <Card className="p-6 text-sm text-muted">
        {t('error_no_order')}
        <div className="mt-4">
          <ButtonLink href={whatsappLink} variant="whatsapp" size="md">
            {t('send_whatsapp')}
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('title')}</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">{t('status')}</h1>
        <p className="mt-3 text-sm text-muted">
          {t('payment_notice')}
        </p>
      </div>
      <Card className="space-y-3 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{t('order_no')}</span>
          <span className="font-semibold text-text">{order.id}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{t('products')}</span>
          <span className="text-text">{order.itemSummary}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{t('quantity')}</span>
          <span className="text-text">{order.totalQuantity}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{t('total')}</span>
          <span className="font-semibold text-red tabular-nums price-reveal">
            {formatPrice(order.totalAmount, locale)}
          </span>
        </div>
      </Card>
      <ButtonLink href={whatsappLink} variant="whatsapp" size="md" fullWidth>
        {t('send_whatsapp')}
      </ButtonLink>
    </div>
  );
};
