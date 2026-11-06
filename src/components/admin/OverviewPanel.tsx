import { useEffect, useState } from 'react';
import { Users, Wallet, Package, Layers, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents } from '@/lib/format';
import { cardClass } from '@/components/ui/styles';

interface OverviewStats {
  investors: number;
  totalInvested: number;
  activeOrders: number;
  openRounds: number;
}

export function OverviewPanel() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [investorsResult, investmentsResult, ordersResult, roundsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'investor'),
        supabase.from('investments').select('amount_cents, status'),
        supabase.from('orders').select('status'),
        supabase.from('investment_offerings').select('id').eq('status', 'open'),
      ]);
      if (!active) return;
      const failed = investorsResult.error || investmentsResult.error || ordersResult.error || roundsResult.error;
      if (failed) {
        setError('We could not load the overview. Please refresh and try again.');
        return;
      }
      const investments = investmentsResult.data ?? [];
      const orders = ordersResult.data ?? [];
      setStats({
        investors: investorsResult.count ?? 0,
        totalInvested: investments
          .filter((item) => item.status === 'confirmed')
          .reduce((sum, item) => sum + item.amount_cents, 0),
        activeOrders: orders.filter((order) => order.status === 'pending' || order.status === 'confirmed').length,
        openRounds: (roundsResult.data ?? []).length,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-20 text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const cards = [
    { icon: Users, label: 'Investors', value: stats.investors.toLocaleString() },
    { icon: Wallet, label: 'Total invested', value: formatCents(stats.totalInvested) },
    { icon: Package, label: 'Active orders', value: stats.activeOrders.toLocaleString() },
    { icon: Layers, label: 'Open rounds', value: stats.openRounds.toLocaleString() },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ icon: Icon, label, value }) => (
        <div key={label} className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-600">{label}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
