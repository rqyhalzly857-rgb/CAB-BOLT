import { ArrowRight } from 'lucide-react';
import { formatCents, formatPercent } from '@/lib/format';
import type { InvestmentOffering } from '@/types/models';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass, primaryButtonClass } from '@/components/ui/styles';

interface InvestmentOfferingCardProps {
  offering: InvestmentOffering;
  onInvest: (offering: InvestmentOffering) => void;
}

export function InvestmentOfferingCard({ offering, onInvest }: InvestmentOfferingCardProps) {
  const isOpen = offering.status === 'open';
  const percentFunded = offering.total_units > 0 ? (offering.units_sold / offering.total_units) * 100 : 0;
  const unitsLeft = offering.total_units - offering.units_sold;
  const model = offering.vehicle_models;

  return (
    <div className={`${cardClass} group flex flex-col overflow-hidden transition duration-300 hover:shadow-lg`}>
      {model?.image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-zinc-100">
          <img
            src={model.image_url}
            alt={model.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={offering.status} label={isOpen ? 'Open' : 'Closed'} />
          {model && <span className="text-sm text-zinc-500">{model.name}</span>}
        </div>

        <h2 className="mt-4 text-xl font-semibold text-zinc-900">{offering.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{offering.summary}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-zinc-200 py-5">
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Per unit</dt>
            <dd className="mt-1 text-base font-semibold text-zinc-900">{formatCents(offering.unit_price_cents)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Exp. return</dt>
            <dd className="mt-1 text-base font-semibold text-emerald-700">
              {formatPercent(offering.expected_annual_return_pct)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Min. units</dt>
            <dd className="mt-1 text-base font-semibold text-zinc-900">{offering.min_units}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600">
              {unitsLeft.toLocaleString()} of {offering.total_units.toLocaleString()} units left
            </span>
            <span className="font-medium text-zinc-900">{Math.round(percentFunded)}% funded</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100" role="progressbar" aria-valuenow={Math.round(percentFunded)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-700"
              style={{ width: `${Math.min(100, percentFunded)}%` }}
            />
          </div>
        </div>

        <div className="mt-auto pt-8">
          {isOpen ? (
            <button type="button" onClick={() => onInvest(offering)} className={`${primaryButtonClass} w-full`}>
              Invest in this round
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <p className="rounded-full bg-zinc-100 px-6 py-3 text-center text-sm font-medium text-zinc-600">
              This round is closed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
