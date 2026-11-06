import type { Investment } from '@/types/models';
import { formatCents, formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass } from '@/components/ui/styles';

interface InvestmentsListProps {
  investments: Investment[];
}

export function InvestmentsList({ investments }: InvestmentsListProps) {
  if (investments.length === 0) {
    return (
      <div className={`${cardClass} p-8 text-center text-sm leading-relaxed text-zinc-600`}>
        You have not invested in any round yet. Once you do, your positions will appear here.
      </div>
    );
  }

  return (
    <ul className={`${cardClass} divide-y divide-zinc-200 overflow-hidden`}>
      {investments.map((item) => (
        <li key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-900">
              {item.investment_offerings?.title ?? 'Investment round'}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {item.units} {item.units === 1 ? 'unit' : 'units'} · {formatDate(item.created_at)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="text-right">
              <p className="font-semibold text-zinc-900">{formatCents(item.amount_cents)}</p>
              {item.investment_offerings && (
                <p className="text-xs text-emerald-700">
                  {item.investment_offerings.expected_annual_return_pct.toFixed(2)}% expected
                </p>
              )}
            </div>
            <StatusBadge status={item.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}
