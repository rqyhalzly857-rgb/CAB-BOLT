import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { InvestmentOffering } from '@/types/models';
import { InvestmentOfferingCard } from '@/components/invest/InvestmentOfferingCard';
import { InvestModal } from '@/components/invest/InvestModal';
import { useAuth } from '@/contexts/auth-context';
import { navigate } from '@/lib/router';
import { cardClass } from '@/components/ui/styles';

export function InvestPage() {
  const { user } = useAuth();
  const [offerings, setOfferings] = useState<InvestmentOffering[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InvestmentOffering | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('investment_offerings')
      .select('*, vehicle_models(name, image_url, slug)')
      .in('status', ['open', 'closed'])
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError('We could not load investment offerings. Please refresh and try again.');
          return;
        }
        setOfferings((data ?? []) as InvestmentOffering[]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleInvest = (offering: InvestmentOffering) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelected(offering);
  };

  const openOfferings = offerings?.filter((offering) => offering.status === 'open') ?? [];
  const closedOfferings = offerings?.filter((offering) => offering.status === 'closed') ?? [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Invest</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Fund the fleet</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          Pick an open round, choose how many units to fund and track your position from your dashboard. Projected
          returns are estimates and are not guaranteed.
        </p>
      </div>

      {error && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      )}

      {!error && offerings === null && (
        <div className="flex justify-center py-24 text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {offerings && offerings.length === 0 && (
        <div className={`${cardClass} mt-10 p-10 text-center text-sm text-zinc-600`}>
          There are no investment rounds open right now. Check back soon.
        </div>
      )}

      {openOfferings.length > 0 && (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {openOfferings.map((offering) => (
            <InvestmentOfferingCard key={offering.id} offering={offering} onInvest={handleInvest} />
          ))}
        </div>
      )}

      {closedOfferings.length > 0 && (
        <>
          <h2 className="mt-16 text-xl font-semibold text-zinc-900">Closed rounds</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {closedOfferings.map((offering) => (
              <InvestmentOfferingCard key={offering.id} offering={offering} onInvest={handleInvest} />
            ))}
          </div>
        </>
      )}

      {selected && <InvestModal offering={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
