import { ArrowRight, Gauge, Users, Battery } from 'lucide-react';
import { formatCents } from '@/lib/format';
import type { VehicleModel } from '@/types/models';
import { cardClass } from '@/components/ui/styles';

interface VehicleCardProps {
  model: VehicleModel;
}

export function VehicleCard({ model }: VehicleCardProps) {
  return (
    <a
      href={`#/vehicles/${model.slug}`}
      className={`${cardClass} group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-600/20`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <img
          src={model.image_url}
          alt={model.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">{model.name}</h3>
            <p className="mt-1 text-sm text-zinc-600">{model.tagline}</p>
          </div>
          <p className="shrink-0 text-lg font-semibold text-zinc-900">{formatCents(model.price_cents)}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-5 text-sm text-zinc-600">
          <span className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-sky-700" />
            {model.range_miles} mi range
          </span>
          <span className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-sky-700" />
            {model.zero_to_sixty_sec}s 0-60
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-700" />
            {model.seats} seats
          </span>
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all duration-300 group-hover:gap-3">
          View details
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}
