import { useEffect, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { InvestmentOffering } from '@/types/models';
import { InvestmentOfferingCard } from '@/components/invest/InvestmentOfferingCard';
import { InvestModal } from '@/components/invest/InvestModal';
import { cardClass } from '@/components/ui/styles';

export function OpportunitiesPanel() {
  const [offerings, setOfferings] = useState<InvestmentOffering[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InvestmentOffering | null>(null);

  useEffect(() => {
    let isMounted = true;
    supabase
      .from('investment_offerings')
      .select('*, vehicle_models(name, image_url, slug)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!isMounted) return;
        if (queryError) {
          setError('We could not load open rounds. Please refresh and try again.');
          return;
        }
        setOfferings((data ?? []) as InvestmentOffering[]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  }

  if (offerings === null) {
    return (
      <div className="flex justify-center py-16 text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (offerings.length === 0) {
    return (
      <div className={`${cardClass} p-8 text-center text-sm leading-relaxed text-zinc-600`}>
        No rounds are open right now. New investment opportunities will appear here.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {offerings.map((offering) => (
          <InvestmentOfferingCard key={offering.id} offering={offering} onInvest={setSelected} />
        ))}
      </div>
      {selected && <InvestModal offering={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
