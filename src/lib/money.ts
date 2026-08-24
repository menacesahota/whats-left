const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatGBP(value: number): string {
  return gbp.format(value);
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Parse a user-entered amount. Empty string is null; invalid or negative is NaN. */
export function parseAmount(raw: string): number | null {
  const trimmed = raw.replace(/£/g, "").replace(/,/g, "").trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return Number.NaN;
  return n;
}

export function isValidNonNegative(raw: string, { allowEmpty = false } = {}): boolean {
  if (raw.trim() === "") return allowEmpty;
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n >= 0;
}

export function isValidPositive(raw: string): boolean {
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n > 0;
}

export function toNumber(raw: string, fallback = 0): number {
  const n = parseAmount(raw);
  if (n === null || !Number.isFinite(n)) return fallback;
  return n;
}

export function newId(): string {
  return crypto.randomUUID();
}
