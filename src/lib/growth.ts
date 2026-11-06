import type { Investment } from '@/types/models';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export interface GrowthPoint {
  time: number;
  invested: number;
  value: number;
}

export interface PositionReturns {
  id: string;
  title: string;
  amountCents: number;
  expectedAnnualPct: number;
  yearlyProjectionCents: number;
  accruedCents: number;
}

function timeOf(item: Investment): number {
  return new Date(item.created_at).getTime();
}

function accruedAt(item: Investment, at: number): number {
  const pct = item.investment_offerings?.expected_annual_return_pct ?? 0;
  const years = Math.max(0, (at - timeOf(item)) / MS_PER_YEAR);
  return item.amount_cents * (pct / 100) * years;
}

export function buildGrowthSeries(investments: Investment[], now: number = Date.now()): GrowthPoint[] {
  const active = investments.filter((item) => item.status === 'confirmed');
  if (active.length === 0) return [];

  const times = [...new Set([...active.map(timeOf), now])].sort((a, b) => a - b);

  return times.map((time) => {
    const owned = active.filter((item) => timeOf(item) <= time);
    const invested = owned.reduce((sum, item) => sum + item.amount_cents, 0);
    const value = owned.reduce((sum, item) => sum + item.amount_cents + accruedAt(item, time), 0);
    return { time, invested, value: Math.round(value) };
  });
}

export function buildPositionReturns(investments: Investment[], now: number = Date.now()): PositionReturns[] {
  return investments
    .filter((item) => item.status === 'confirmed')
    .map((item) => {
      const pct = item.investment_offerings?.expected_annual_return_pct ?? 0;
      return {
        id: item.id,
        title: item.investment_offerings?.title ?? 'Investment round',
        amountCents: item.amount_cents,
        expectedAnnualPct: pct,
        yearlyProjectionCents: Math.round(item.amount_cents * (pct / 100)),
        accruedCents: Math.round(accruedAt(item, now)),
      };
    });
}
