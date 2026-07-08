export function euro(value: number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return `${Number(value).toLocaleString("de-DE")} €`;
}

export function priceLabel(price: number, priceFrom: boolean, priceSuffix?: string): string {
  const base = `${priceFrom ? "ab " : ""}${euro(price)}`;
  return priceSuffix ? `${base} ${priceSuffix}` : base;
}

export function cleanPostcode(value: string | undefined | null): string {
  return String(value ?? "").replace(/\D/g, "").slice(0, 5);
}
