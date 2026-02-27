export const formatPrice = (value: number, locale: string = "tr-TR") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
