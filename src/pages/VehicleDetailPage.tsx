import { useEffect, useState } from 'react';
import { ArrowLeft, Battery, Gauge, Loader as Loader2, Users, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents } from '@/lib/format';
import type { VehicleModel } from '@/types/models';
import { OrderPanel } from '@/components/vehicles/OrderPanel';
import { cardClass } from '@/components/ui/styles';

interface VehicleDetailPageProps {
  slug: string;
}

export function VehicleDetailPage({ slug }: VehicleDetailPageProps) {
  const [model, setModel] = useState<VehicleModel | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    supabase
      .from('vehicle_models')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setStatus('error');
          return;
        }
        if (!data) {
          setStatus('missing');
          return;
        }
        setModel(data as VehicleModel);
        setStatus('ready');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (status !== 'ready' || !model) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {status === 'missing' ? 'Vehicle not found' : 'We could not load this vehicle'}
        </h1>
        <a href="#/vehicles" className="mt-6 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
          Back to all vehicles
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <a
        href="#/vehicles"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All vehicles
      </a>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <div>
          <div className="overflow-hidden rounded-3xl bg-zinc-100 shadow-lg ring-1 ring-zinc-900/5">
            <img src={model.image_url} alt={model.name} className="aspect-[16/10] h-full w-full object-cover" />
          </div>

          <p className="mt-10 text-sm font-medium tracking-wide text-sky-700">{model.tagline}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">{model.name}</h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.5] text-zinc-700">{model.description}</p>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Battery, label: 'Range', value: `${model.range_miles} mi` },
              { icon: Zap, label: 'Top speed', value: `${model.top_speed_mph} mph` },
              { icon: Gauge, label: '0-60 mph', value: `${model.zero_to_sixty_sec}s` },
              { icon: Users, label: 'Seats', value: String(model.seats) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={`${cardClass} p-5 transition duration-300 hover:shadow-md`}>
                <Icon className="h-5 w-5 text-sky-700" />
                <dt className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-zinc-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className={`${cardClass} p-6 shadow-md sm:p-8`}>
            <p className="text-sm text-zinc-500">Starting price</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">{formatCents(model.price_cents)}</p>
            <div className="mt-6 border-t border-zinc-200 pt-6">
              <OrderPanel model={model} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
