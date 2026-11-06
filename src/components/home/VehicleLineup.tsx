import { useEffect, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { VehicleModel } from '@/types/models';
import { VehicleCard } from '@/components/vehicles/VehicleCard';

export function VehicleLineup() {
  const [models, setModels] = useState<VehicleModel[] | null>(null);
  const [error, setError] = useState(false);

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
          setError(true);
          return;
        }
        setModels((data ?? []) as VehicleModel[]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-zinc-600">Our lineup is unavailable right now. Please try again shortly.</p>;
  }

  if (models === null) {
    return (
      <div className="flex justify-center py-16 text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {models.map((model) => (
        <VehicleCard key={model.id} model={model} />
      ))}
    </div>
  );
}
