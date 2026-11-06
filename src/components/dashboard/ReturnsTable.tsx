import { formatCents, formatPercent } from '@/lib/format';
import type { PositionReturns } from '@/lib/growth';
import { cardClass } from '@/components/ui/styles';

interface ReturnsTableProps {
  positions: PositionReturns[];
}

export function ReturnsTable({ positions }: ReturnsTableProps) {
  if (positions.length === 0) {
    return (
      <div className={`${cardClass} p-8 text-center text-sm leading-[1.5] text-zinc-600`}>
        Returns are shown per position once you have invested in a round.
      </div>
    );
  }

  const totalYearly = positions.reduce((sum, item) => sum + item.yearlyProjectionCents, 0);
  const totalAccrued = positions.reduce((sum, item) => sum + item.accruedCents, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className={`${cardClass} p-6`}>
          <p className="text-sm font-medium text-zinc-600">Projected yearly income</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{formatCents(totalYearly)}</p>
        </div>
        <div className={`${cardClass} p-6`}>
          <p className="text-sm font-medium text-zinc-600">Accrued to date (estimate)</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{formatCents(totalAccrued)}</p>
        </div>
      </div>

      <div className={`${cardClass} overflow-x-auto`}>
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Round</th>
              <th scope="col" className="px-5 py-3 font-medium">Invested</th>
              <th scope="col" className="px-5 py-3 font-medium">Expected return</th>
              <th scope="col" className="px-5 py-3 font-medium">Yearly projection</th>
              <th scope="col" className="px-5 py-3 font-medium">Accrued to date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {positions.map((item) => (
              <tr key={item.id} className="transition hover:bg-zinc-50">
                <th scope="row" className="px-5 py-4 text-left font-semibold text-zinc-900">{item.title}</th>
                <td className="px-5 py-4 text-zinc-700">{formatCents(item.amountCents)}</td>
                <td className="px-5 py-4 text-emerald-700">{formatPercent(item.expectedAnnualPct)}</td>
                <td className="px-5 py-4 text-zinc-700">{formatCents(item.yearlyProjectionCents)}</td>
                <td className="px-5 py-4 text-zinc-700">{formatCents(item.accruedCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-[1.5] text-zinc-500">
        Projections are estimates based on expected annual returns and are not guaranteed. You could lose some or all of the
        amount invested.
      </p>
    </div>
  );
}
