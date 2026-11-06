const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatCents(cents: number): string {
  return currency.format(cents / 100);
}

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}
