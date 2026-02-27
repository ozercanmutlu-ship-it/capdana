"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { paymentConfig } from "@/config/payment";
import { formatPrice } from "@/lib/format";
import { bandanaById, frontById } from "@/lib/capdana";
import type { CartItem } from "./CartProvider";
import { Button } from "./ui/Button";
import { useToast } from "./ToastProvider";
import { cx } from "@/lib/cn";
import { CartItemThumbnail } from "@/components/CartItemThumbnail";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { trackEvent } from "@/lib/analytics";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onComplete: () => void;
};

type OrderFormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

type OrderRecord = {
  id: string;
  createdAt: string;
  customer: OrderFormState;
  items: CartItem[];
  itemSummary: string;
  totalQuantity: number;
  totalAmount: number;
};


const initialFormState: OrderFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

const generateOrderNumber = () =>
  `SW-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

const splitOrderCode = (text: string) => {
  const match = text.match(/[A-Z0-9]+(?:-[A-Z0-9]+)+/);
  if (!match) return { code: null as string | null, before: text, after: "" };
  const code = match[0];
  const [before, after = ""] = text.split(code);
  return { code, before, after };
};

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M9 9h10v10H9z" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

type CopyRowProps = {
  label: string;
  value?: string;
  copyValue: string;
  field: string;
  mono?: boolean;
  copiedField: string | null;
  helperText?: string;
  helperFlash?: boolean;
  onCopy: (field: string, value: string) => void | Promise<void>;
  children?: ReactNode;
};

const CopyRow = ({
  label,
  value,
  copyValue,
  field,
  mono = false,
  copiedField,
  helperText,
  helperFlash,
  onCopy,
  children,
}: CopyRowProps) => {
  const isCopied = copiedField === field;
  const t = useTranslations('Payment');
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-muted/70">{label}</p>
        {helperText ? (
          <p
            className={cx(
              "mt-1 text-xs text-muted/70",
              "max-w-[42ch] leading-snug",
              "motion-safe:transition motion-safe:duration-200",
              helperFlash
                ? "text-text/80 underline decoration-neon/50 underline-offset-[3px]"
                : "no-underline decoration-transparent"
            )}
          >
            {helperText}
          </p>
        ) : null}
        <div
          className={cx(
            "mt-1.5 rounded-xl border border-text/10 bg-bg/30 px-4 py-3 text-sm text-text",
            "select-text break-words",
            mono && "font-mono text-xs tracking-[0.02em]"
          )}
        >
          {children ? children : value}
        </div>
      </div>
      <Button
        type="button"
        onClick={() => onCopy(field, copyValue)}
        variant="secondary"
        size="sm"
        className={cx(
          "mt-0.5 inline-flex w-32 items-center justify-center gap-2 rounded-full",
          "motion-safe:active:scale-[0.98]"
        )}
      >
        <CopyIcon />
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">
          {isCopied ? t('copied_label') : t('copy_label')}
        </span>
      </Button>
    </div>
  );
};

export const PaymentModal = ({ isOpen, onClose, items, onComplete }: PaymentModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <PaymentModalContent onClose={onClose} items={items} onComplete={onComplete} />,
    document.body
  );
};

const PaymentModalContent = ({
  onClose,
  items,
  onComplete,
}: Omit<PaymentModalProps, "isOpen">) => {
  const t = useTranslations('Payment');
  const locale = useLocale();
  const router = useRouter();
  const { show } = useToast();
  const [step, setStep] = useState<"payment" | "form" | "success">("payment");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [helperFlashField, setHelperFlashField] = useState<string | null>(null);
  const [orderNumber] = useState(generateOrderNumber);
  const [formState, setFormState] = useState<OrderFormState>(initialFormState);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const itemSummary = useMemo(() => {
    if (items.length === 0) return "-";
    return items
      .map((item) => {
        if (item.type === "ready") {
          return `${item.name} x${item.quantity}`;
        }
        const frontLabel = item.frontId ? frontById.get(item.frontId)?.name : "-";
        const bandanaLabel = item.bandanaId
          ? bandanaById.get(item.bandanaId)?.name
          : "-";
        return `${item.name} (${frontLabel} + ${bandanaLabel}) x${item.quantity}`;
      })
      .join(", ");
  }, [items]);

  const handleCopy = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 900);
      if (field === "description") {
        setHelperFlashField("description");
        window.setTimeout(() => setHelperFlashField(null), 320);
      }
      show(t('copied_label'));
    } catch {
      setCopiedField(null);
    }
  };

  const descriptionText = `Capdana - ${orderNumber} - ${itemSummary} - ${totalQuantity} - ${totalAmount}TL`;
  const descriptionParts = splitOrderCode(descriptionText);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "authenticated") {
      show("Sipariş vermek için giriş yapmalısınız.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API'ye gönderilecek veri formatı
      const orderData = {
        totalAmount,
        items: JSON.stringify(items.map(i => ({
          ...i,
          name: i.type === "ready" ? i.name : `${i.name} (${frontById.get(i.frontId!)?.name} + ${bandanaById.get(i.bandanaId!)?.name})`
        }))),
        shipping: formState,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Sipariş oluşturulamadı");
      }

      const dbOrder = await response.json();

      // Modal içi gösterim için geçici kayıt
      const uiRecord: OrderRecord = {
        id: dbOrder.id, // Veritabanından gelen gerçek ID
        createdAt: dbOrder.createdAt,
        customer: formState, // Form bilgisi şu an db'ye gitmiyor ama ileride eklenebilir, UI için tutuyoruz
        items,
        itemSummary,
        totalQuantity,
        totalAmount,
      };

      setSubmittedOrder(uiRecord);
      setStep("success");
      trackEvent("purchase", {
        transaction_id: dbOrder.id,
        currency: "TRY",
        value: totalAmount,
        items: JSON.stringify(items.map(i => ({
          item_id: i.id,
          item_name: i.name,
          quantity: i.quantity,
          price: i.price,
        }))),
      });
      onComplete(); // Sepeti temizler

    } catch (error) {
      console.error(error);
      show("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="isolate w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="max-h-[85vh] overflow-y-auto overscroll-contain px-5 py-5 md:px-8 md:py-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{t('payment_tab')}</p>
                <h2 className="mt-2 text-2xl font-semibold leading-[1.05] tracking-tight text-text md:text-3xl">
                  {step === "payment"
                    ? t('title')
                    : step === "form"
                      ? t('notif_title')
                      : t('success_title')}
                </h2>
                {step === "payment" ? (
                  <div className="mt-4 inline-flex items-center rounded-full border border-[var(--accent-color)]/20 bg-[var(--accent-color)]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--accent-color)] shadow-[0_0_15px_var(--accent-glow)]">
                    HAVALE / EFT
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-text/10 bg-bg/40 text-text transition hover:border-neon/40"
                aria-label={t('done')}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {step === "payment" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-inner md:p-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted/80">
                      {t('transfer_info')}
                    </p>
                    <div className="mt-5 space-y-4">
                      <CopyRow
                        label={t('recipient')}
                        value={paymentConfig.recipientName}
                        copyValue={paymentConfig.recipientName}
                        field="recipient"
                        copiedField={copiedField}
                        onCopy={handleCopy}
                      />
                      <CopyRow
                        label={t('iban')}
                        value={paymentConfig.ibanDisplay}
                        copyValue={paymentConfig.ibanCopy}
                        field="iban"
                        mono
                        copiedField={copiedField}
                        onCopy={handleCopy}
                      />
                      <CopyRow
                        label={t('description')}
                        copyValue={descriptionText}
                        field="description"
                        mono
                        copiedField={copiedField}
                        helperText={t('copy_desc_helper')}
                        helperFlash={helperFlashField === "description"}
                        onCopy={handleCopy}
                      >
                        <span className="text-text">
                          {descriptionParts.before}
                          {descriptionParts.code ? (
                            <span
                              className={cx(
                                "mx-1 inline-flex items-center rounded-full border border-text/15 bg-bg/40 px-2.5 py-1",
                                "font-mono text-[11px] tracking-[0.02em] text-text",
                                "transition motion-safe:hover:border-neon/40"
                              )}
                            >
                              {descriptionParts.code}
                            </span>
                          ) : null}
                          {descriptionParts.after}
                        </span>
                      </CopyRow>
                    </div>
                    <p className="mt-5 text-sm text-muted">
                      {t('next_steps_helper')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[var(--accent-color)]/10 bg-gradient-to-b from-[var(--accent-color)]/[0.03] to-transparent p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_30px_rgba(255,77,77,0.03)] md:p-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted/80">{t('summary')}</p>
                    <div className="mt-5 space-y-4">
                      {items.map((item) => {
                        const frontSrc = item.frontId ? frontById.get(item.frontId)?.image : undefined;
                        const bandanaSrc = item.bandanaId ? bandanaById.get(item.bandanaId)?.image : undefined;
                        const readySrc = item.image;
                        return (
                          <div key={item.id} className="flex items-center gap-3">
                            <CartItemThumbnail
                              type={item.type}
                              alt={item.name}
                              readySrc={readySrc}
                              frontSrc={frontSrc}
                              bandanaSrc={bandanaSrc}
                              sizeClassName="h-14 w-14"
                              sizes="56px"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text">{item.name}</p>
                              <p className="text-xs text-muted tabular-nums">x{item.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 space-y-3 text-sm text-muted">
                      <div className="flex items-center justify-between gap-4">
                        <span>{t('total')}</span>
                        <span className="text-2xl font-bold text-red tabular-nums price-reveal">
                          {formatPrice(totalAmount, locale)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>{t('quantity')}</span>
                        <span className="tabular-nums">{totalQuantity}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>{t('order_no')}</span>
                        <span className="font-mono text-xs text-text break-words">{orderNumber}</span>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-white/5 pt-5">
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 px-4 py-4 shadow-sm">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                          {t('total_row')}
                        </span>
                        <span className="text-xl font-black text-text tabular-nums tracking-tight">
                          {formatPrice(totalAmount, locale)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5">
                      {status === "unauthenticated" ? (
                        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-center">
                          <p className="text-sm font-semibold text-yellow-500 mb-3">Sipariş verebilmek için giriş yapmalısınız.</p>
                          <Button
                            type="button"
                            fullWidth
                            onClick={() => {
                              onClose();
                              router.push(`/${locale}/login`);
                            }}
                          >
                            Giriş Yap / Kayıt Ol
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => setStep("form")}
                          disabled={totalQuantity === 0}
                          fullWidth
                          className="press-cta"
                        >
                          {t('payment_done_button')}
                        </Button>
                      )}

                      <Button
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        fullWidth
                        className="mt-2"
                      >
                        {t('done')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "form" && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs text-muted">{t('form.full_name')}</label>
                        <input
                          required
                          value={formState.fullName}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, fullName: event.target.value }))
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:border-[var(--accent-color)]/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted">{t('form.phone')}</label>
                        <input
                          required
                          value={formState.phone}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, phone: event.target.value }))
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:border-[var(--accent-color)]/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted">{t('form.email')}</label>
                        <input
                          value={formState.email}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, email: event.target.value }))
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:border-[var(--accent-color)]/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted">{t('form.address')}</label>
                        <input
                          required
                          value={formState.address}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, address: event.target.value }))
                          }
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:border-[var(--accent-color)]/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted">{t('form.note')}</label>
                      <textarea
                        value={formState.note}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, note: event.target.value }))
                        }
                        className="h-28 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:border-[var(--accent-color)]/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-inner">
                      <p className="text-xs font-medium uppercase tracking-widest text-muted/80">{t('products_title')}</p>
                      <div className="mt-5 space-y-4">
                        {items.map((item) => {
                          const frontSrc = item.frontId ? frontById.get(item.frontId)?.image : undefined;
                          const bandanaSrc = item.bandanaId ? bandanaById.get(item.bandanaId)?.image : undefined;
                          const readySrc = item.image;
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              <CartItemThumbnail
                                type={item.type}
                                alt={item.name}
                                readySrc={readySrc}
                                frontSrc={frontSrc}
                                bandanaSrc={bandanaSrc}
                                sizeClassName="h-12 w-12"
                                sizes="48px"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-text">{item.name}</p>
                                <p className="text-xs text-muted tabular-nums">x{item.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid gap-5 rounded-2xl border border-white/5 bg-black/20 p-5 text-sm md:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted">{t('product_model')}</p>
                        <p className="font-medium text-text break-words">{itemSummary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">{t('product_quantity')}</p>
                        <p className="font-medium text-text tabular-nums">{totalQuantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">{t('product_total')}</p>
                        <p className="font-bold text-red tabular-nums price-reveal">
                          {formatPrice(totalAmount, locale)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">{t('order_no_label')}</p>
                        <p className="font-mono text-xs text-text break-words">{orderNumber}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <Button type="button" onClick={() => setStep("payment")} variant="secondary" disabled={isSubmitting}>
                        {t('back')}
                      </Button>
                      <Button type="submit" className="press-cta" disabled={isSubmitting}>
                        {isSubmitting ? "Sipariş Oluşturuluyor..." : t('create_order_button')}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {step === "success" && submittedOrder && (
              <div className="space-y-6">
                <div className="rounded-xl border border-text/5 bg-surface p-5">
                  <p className="text-sm text-muted">{t('order_no_label')}</p>
                  <p className="mt-2 text-xl font-semibold text-text">{submittedOrder.id}</p>
                  <p className="mt-2 text-sm text-muted">
                    {submittedOrder.itemSummary} • {submittedOrder.totalQuantity} {t('unit')}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {t('total_row')}{" "}
                    <span className="font-bold text-red tabular-nums price-reveal">
                      {formatPrice(submittedOrder.totalAmount, locale)}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-muted">
                  {t('success_msg')}
                </p>
                <div className="flex justify-end">
                  <Button type="button" onClick={onClose} className="press-cta">
                    {t('done')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
