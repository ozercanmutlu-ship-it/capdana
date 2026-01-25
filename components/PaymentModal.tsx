"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { paymentConfig } from "@/config/payment";
import { formatPrice } from "@/lib/format";
import { modelById, product } from "@/lib/products";
import type { CartItem } from "./CartProvider";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
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
  modelSummary: string;
  totalQuantity: number;
  totalAmount: number;
};

const ORDER_STORAGE_KEY = "senteWearOrders";

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

export const PaymentModal = ({ isOpen, onClose, items }: PaymentModalProps) => {
  const [step, setStep] = useState<"payment" | "form" | "success">("payment");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [formState, setFormState] = useState<OrderFormState>(initialFormState);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);
  const hasOpenedWhatsapp = useRef(false);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const totalAmount = totalQuantity * product.price;

  const modelSummary = useMemo(() => {
    if (items.length === 0) return "-";
    return items
      .map((item) => {
        const label = modelById.get(item.modelId)?.label ?? item.modelId;
        return `${label} x${item.quantity}`;
      })
      .join(", ");
  }, [items]);

  useEffect(() => {
    if (!isOpen) return;
    setStep("payment");
    setCopiedField(null);
    setOrderNumber(generateOrderNumber());
    setFormState(initialFormState);
    setSubmittedOrder(null);
    hasOpenedWhatsapp.current = false;
  }, [isOpen, items]);

  const handleCopy = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1500);
    } catch {
      setCopiedField(null);
    }
  };

  const descriptionText = `SenteWear - ${orderNumber} - ${modelSummary} - ${totalQuantity} - ${totalAmount}TL`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const order: OrderRecord = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      customer: formState,
      items,
      modelSummary,
      totalQuantity,
      totalAmount,
    };
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(ORDER_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as OrderRecord[]) : [];
      window.localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify([order, ...(Array.isArray(parsed) ? parsed : [])])
      );
    }
    setSubmittedOrder(order);
    setStep("success");

    if (typeof window !== "undefined" && !hasOpenedWhatsapp.current) {
      const message = `Merhaba,\n\nSENTE WEAR sipariş oluşturdum.\n\nSipariş No: ${orderNumber}\nModel: ${modelSummary}\nAdet: ${totalQuantity}\nTutar: ${totalAmount} TL\n\nHavale yaptım.`;
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/905316102817?text=${encodedMessage}`;
      window.open(url, "_blank", "noopener,noreferrer");
      hasOpenedWhatsapp.current = true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
        {step === "payment" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Havale/EFT ile Ödeme</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-400"
              >
                Kapat
              </button>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5">
              <p className="text-sm text-neutral-500">Toplam Tutar</p>
              <p className="mt-2 text-2xl font-semibold">{formatPrice(totalAmount)}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {totalQuantity} adet × {formatPrice(product.price)}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Alıcı</p>
                    <p className="font-medium text-neutral-900">
                      {paymentConfig.recipientName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy("recipient", paymentConfig.recipientName)
                    }
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                  >
                    {copiedField === "recipient" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">IBAN</p>
                    <p className="font-medium text-neutral-900">
                      {paymentConfig.ibanDisplay}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("iban", paymentConfig.ibanCopy)}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                  >
                    {copiedField === "iban" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Açıklama</p>
                    <p className="font-medium text-neutral-900">{descriptionText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("description", descriptionText)}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                  >
                    {copiedField === "description" ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              Ödemeyi yaptıktan sonra “Ödemeyi Yaptım” ile bilgilerini gönder.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                disabled={totalQuantity === 0}
              >
                Ödemeyi Yaptım
              </button>
            </div>
          </div>
        )}

        {step === "form" && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ödeme Bildirimi</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-400"
              >
                Kapat
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Ad Soyad</label>
                <input
                  required
                  value={formState.fullName}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Telefon</label>
                <input
                  required
                  value={formState.phone}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">E-posta (opsiyonel)</label>
                <input
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Adres</label>
                <input
                  required
                  value={formState.address}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, address: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-neutral-500">Not</label>
              <textarea
                value={formState.note}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, note: event.target.value }))
                }
                className="h-24 w-full resize-none rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
              />
            </div>
            <div className="grid gap-4 rounded-2xl border border-neutral-200 p-4 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs text-neutral-500">Model</p>
                <p className="font-medium text-neutral-900">{modelSummary}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Adet</p>
                <p className="font-medium text-neutral-900">{totalQuantity}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Tutar</p>
                <p className="font-medium text-neutral-900">{formatPrice(totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Sipariş No</p>
                <p className="font-medium text-neutral-900">{orderNumber}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setStep("payment")}
                className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400"
              >
                Geri
              </button>
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Siparişi Oluştur
              </button>
            </div>
          </form>
        )}

        {step === "success" && submittedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sipariş Alındı</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:border-neutral-400"
              >
                Kapat
              </button>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5">
              <p className="text-sm text-neutral-500">Sipariş No</p>
              <p className="mt-2 text-xl font-semibold">{submittedOrder.id}</p>
              <p className="mt-2 text-sm text-neutral-600">
                {submittedOrder.modelSummary} • {submittedOrder.totalQuantity} adet
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Toplam {formatPrice(submittedOrder.totalAmount)}
              </p>
            </div>
            <p className="text-sm text-neutral-600">
              Ödeme bildiriminizi aldık. Ekibimiz en kısa sürede dönüş yapacaktır.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Tamam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
