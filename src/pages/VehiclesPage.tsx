import { useEffect, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { VehicleModel } from '@/types/models';
import { cardClass } from '@/components/ui/styles';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleComparison } from '@/components/vehicles/VehicleComparison';

export function VehiclesPage() {
  const [models, setModels] = useState<VehicleModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('vehicle_models')
      .select('*')
      .eq('is_published', true)
      .order('price_cents', { ascending: true })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError('We could not load our vehicles. Please refresh and try again.');
          return;
        }
        setModels((data ?? []) as VehicleModel[]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-sky-700">Vehicles</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">Choose your ride</h1>
        <p className="mt-4 text-base leading-[1.5] text-zinc-600">
          Every model is reservable online. Pick a vehicle to see its specifications and place a reservation.
        </p>
      </div>

      {error && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      )}

      {!error && models === null && (
        <div className="flex justify-center py-24 text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {models && models.length === 0 && (
        <div className={`${cardClass} mt-10 p-10 text-center text-sm text-zinc-600`}>
          No vehicles are available right now. Check back soon.
        </div>
      )}

      {models && models.length > 0 && (
        <>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {models.map((model) => (
              <VehicleCard key={model.id} model={model} />
            ))}
          </div>
          {models.length > 1 && <VehicleComparison models={models} />}
        </>
      )}
    </div>
  );
}
