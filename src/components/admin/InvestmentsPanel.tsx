import { useEffect, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents, formatDate } from '@/lib/format';
import type { Investment } from '@/types/models';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass } from '@/components/ui/styles';

export function InvestmentsPanel() {
  const [investments, setInvestments] = useState<Investment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('investments')
      .select('*, investment_offerings(title, unit_price_cents, expected_annual_return_pct, vehicle_models(name)), profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError('We could not load investments. Please refresh and try again.');
          return;
        }
        setInvestments((data ?? []) as Investment[]);
      });
    return () => {
      active = false;
    };
  }, []);

  const confirmedTotal = (investments ?? [])
    .filter((item) => item.status === 'confirmed')
    .reduce((sum, item) => sum + item.amount_cents, 0);

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Investments</h2>
          <p className="mt-1 text-sm text-zinc-600">Every investor position across all rounds. Records are read-only.</p>
        </div>
        {investments && (
          <p className="text-sm text-zinc-600">
            Confirmed total: <span className="font-semibold text-zinc-900">{formatCents(confirmedTotal)}</span>
          </p>
        )}
      </div>

      <div className="mt-8">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {!error && investments === null && (
          <div className="flex justify-center py-20 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {investments && investments.length === 0 && (
          <div className={`${cardClass} p-10 text-center text-sm text-zinc-600`}>No investments recorded yet.</div>
        )}

        {investments && investments.length > 0 && (
          <div className={`${cardClass} overflow-x-auto`}>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Investor</th>
                  <th className="px-5 py-3 font-medium">Round</th>
                  <th className="px-5 py-3 font-medium">Units</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {investments.map((item) => (
                  <tr key={item.id} className="transition hover:bg-zinc-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-900">{item.profiles?.full_name || 'Unnamed'}</p>
                      <p className="text-xs text-zinc-500">{item.profiles?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-900">{item.investment_offerings?.title ?? 'Investment round'}</p>
                      <p className="text-xs text-zinc-500">{item.investment_offerings?.vehicle_models?.name ?? ''}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-700">{item.units}</td>
                    <td className="px-5 py-4 text-zinc-700">{formatCents(item.amount_cents)}</td>
                    <td className="px-5 py-4 text-zinc-700">{formatDate(item.created_at)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
