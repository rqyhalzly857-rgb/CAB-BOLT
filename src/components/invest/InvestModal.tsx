import { useState } from 'react';
import { CheckCircle2, Loader2, Minus, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents, formatPercent } from '@/lib/format';
import type { InvestmentOffering } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '@/components/ui/styles';

interface InvestModalProps {
  offering: InvestmentOffering;
  onClose: () => void;
}

export function InvestModal({ offering, onClose }: InvestModalProps) {
  const unitsLeft = offering.total_units - offering.units_sold;
  const [units, setUnits] = useState(offering.min_units);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const amount = units * offering.unit_price_cents;
  const projectedAnnual = amount * (offering.expected_annual_return_pct / 100);

  const clampUnits = (value: number) => Math.min(unitsLeft, Math.max(offering.min_units, Math.floor(value) || 0));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc('invest_in_offering', {
      p_offering_id: offering.id,
      p_units: units,
    });
    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setCompleted(true);
  };

  if (completed) {
    return (
      <Modal title="Investment confirmed" onClose={onClose}>
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="mt-5 text-sm leading-relaxed text-zinc-600">
            You invested {units} {units === 1 ? 'unit' : 'units'} ({formatCents(amount)}) in {offering.title}. You can follow
            this position from your dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a href="#/dashboard" className={primaryButtonClass}>
              View my dashboard
            </a>
            <button type="button" onClick={onClose} className={secondaryButtonClass}>
              Done
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Invest in ${offering.title}`} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label htmlFor="invest-units" className={labelClass}>
            Number of units
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setUnits((value) => clampUnits(value - 1))}
              disabled={units <= offering.min_units}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40"
              aria-label="Decrease units"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              id="invest-units"
              type="number"
              inputMode="numeric"
              min={offering.min_units}
              max={unitsLeft}
              value={units}
              onChange={(event) => setUnits(clampUnits(Number(event.target.value)))}
              className={`${inputClass} text-center text-lg font-semibold`}
            />
            <button
              type="button"
              onClick={() => setUnits((value) => clampUnits(value + 1))}
              disabled={units >= unitsLeft}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40"
              aria-label="Increase units"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Minimum {offering.min_units} {offering.min_units === 1 ? 'unit' : 'units'}. {unitsLeft.toLocaleString()} left in
            this round.
          </p>
        </div>

        <dl className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-zinc-50 px-5">
          <div className="flex items-center justify-between py-4">
            <dt className="text-sm text-zinc-600">Price per unit</dt>
            <dd className="text-sm font-medium text-zinc-900">{formatCents(offering.unit_price_cents)}</dd>
          </div>
          <div className="flex items-center justify-between py-4">
            <dt className="text-sm text-zinc-600">Total investment</dt>
            <dd className="text-base font-semibold text-zinc-900">{formatCents(amount)}</dd>
          </div>
          <div className="flex items-center justify-between py-4">
            <dt className="text-sm text-zinc-600">Projected yearly return ({formatPercent(offering.expected_annual_return_pct)})</dt>
            <dd className="text-sm font-semibold text-emerald-700">{formatCents(projectedAnnual)}</dd>
          </div>
        </dl>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="space-y-3">
          <button
            type="button"
            onClick={submit}
            disabled={submitting || unitsLeft < offering.min_units}
            className={`${primaryButtonClass} w-full`}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm investment
          </button>
          <p className="text-xs leading-relaxed text-zinc-500">
            Projected returns are estimates and not guaranteed. You could lose some or all of the amount invested.
          </p>
        </div>
      </div>
    </Modal>
  );
}
