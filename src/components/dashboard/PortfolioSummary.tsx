import { Banknote, Layers, Package, TrendingUp } from 'lucide-react';
import { formatCents, formatPercent } from '@/lib/format';
import type { Investment, VehicleOrder } from '@/types/models';
import { cardClass } from '@/components/ui/styles';

interface PortfolioSummaryProps {
  investments: Investment[];
  orders: VehicleOrder[];
}

export function PortfolioSummary({ investments, orders }: PortfolioSummaryProps) {
  const activeInvestments = investments.filter((item) => item.status === 'confirmed');
  const totalInvested = activeInvestments.reduce((sum, item) => sum + item.amount_cents, 0);
  const totalUnits = activeInvestments.reduce((sum, item) => sum + item.units, 0);
  const projectedAnnual = activeInvestments.reduce((sum, item) => {
    const pct = item.investment_offerings?.expected_annual_return_pct ?? 0;
    return sum + item.amount_cents * (pct / 100);
  }, 0);
  const blendedReturn = totalInvested > 0 ? (projectedAnnual / totalInvested) * 100 : 0;
  const activeOrders = orders.filter((order) => order.status !== 'cancelled');

  const stats = [
    { icon: Banknote, label: 'Total invested', value: formatCents(totalInvested), hint: `${activeInvestments.length} active positions` },
    { icon: Layers, label: 'Units owned', value: totalUnits.toLocaleString(), hint: 'Across all rounds' },
    {
      icon: TrendingUp,
      label: 'Projected yearly return',
      value: formatCents(projectedAnnual),
      hint: totalInvested > 0 ? `Blended ${formatPercent(blendedReturn)} estimate` : 'Invest to see estimates',
    },
    { icon: Package, label: 'Vehicle orders', value: String(activeOrders.length), hint: 'Reservations in progress' },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, hint }) => (
        <div key={label} className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-600">{label}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>
        </div>
      ))}
    </div>
  );
}
