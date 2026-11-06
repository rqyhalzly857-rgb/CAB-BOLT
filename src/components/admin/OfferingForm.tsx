import { useState, type FormEvent } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { dollarsToCents, fromDatetimeLocalValue, toDatetimeLocalValue } from '@/lib/format';
import type { InvestmentOffering, OfferingStatus } from '@/types/models';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '@/components/ui/styles';

export interface ModelOption {
  id: string;
  name: string;
}

interface OfferingFormProps {
  offering: InvestmentOffering | null;
  models: ModelOption[];
  onSaved: () => void;
  onCancel: () => void;
}

const statusOptions: { value: OfferingStatus; label: string }[] = [
  { value: 'draft', label: 'Draft (hidden from investors)' },
  { value: 'open', label: 'Open (accepting investments)' },
  { value: 'closed', label: 'Closed (no new investments)' },
];

export function OfferingForm({ offering, models, onSaved, onCancel }: OfferingFormProps) {
  const [modelId, setModelId] = useState(offering?.model_id ?? models[0]?.id ?? '');
  const [title, setTitle] = useState(offering?.title ?? '');
  const [summary, setSummary] = useState(offering?.summary ?? '');
  const [unitPrice, setUnitPrice] = useState(offering ? String(offering.unit_price_cents / 100) : '');
  const [totalUnits, setTotalUnits] = useState(offering ? String(offering.total_units) : '');
  const [minUnits, setMinUnits] = useState(offering ? String(offering.min_units) : '1');
  const [expectedReturn, setExpectedReturn] = useState(
    offering ? String(offering.expected_annual_return_pct) : '',
  );
  const [status, setStatus] = useState<OfferingStatus>(offering?.status ?? 'draft');
  const [closesAt, setClosesAt] = useState(toDatetimeLocalValue(offering?.closes_at ?? null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const price = Number(unitPrice);
    const total = Number(totalUnits);
    const min = Number(minUnits);
    const returnPct = Number(expectedReturn);

    if (!modelId) return setError('Choose a vehicle for this round.');
    if (!title.trim()) return setError('Enter a title for this round.');
    if (!(price > 0)) return setError('Enter a unit price greater than zero.');
    if (!Number.isInteger(total) || total < 1) return setError('Total units must be a whole number of at least 1.');
    if (!Number.isInteger(min) || min < 1 || min > total) {
      return setError('Minimum units must be a whole number between 1 and the total units.');
    }
    if (!(returnPct >= 0)) return setError('Enter an expected return of 0% or more.');

    const payload = {
      model_id: modelId,
      title: title.trim(),
      summary: summary.trim(),
      unit_price_cents: dollarsToCents(price),
      total_units: total,
      min_units: min,
      expected_annual_return_pct: returnPct,
      status,
      closes_at: fromDatetimeLocalValue(closesAt),
    };

    setSubmitting(true);
    const result = offering
      ? await supabase.from('investment_offerings').update(payload).eq('id', offering.id)
      : await supabase.from('investment_offerings').insert(payload);
    setSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="offering-model" className={labelClass}>
          Vehicle
        </label>
        <select
          id="offering-model"
          value={modelId}
          onChange={(event) => setModelId(event.target.value)}
          className={inputClass}
        >
          {models.length === 0 && <option value="">No vehicles available</option>}
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="offering-title" className={labelClass}>
          Round title
        </label>
        <input
          id="offering-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
          placeholder="Cybercab Fleet Round 2"
        />
      </div>

      <div>
        <label htmlFor="offering-summary" className={labelClass}>
          Summary
        </label>
        <textarea
          id="offering-summary"
          rows={3}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="offering-unit-price" className={labelClass}>
            Unit price (USD)
          </label>
          <input
            id="offering-unit-price"
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="offering-return" className={labelClass}>
            Expected annual return (%)
          </label>
          <input
            id="offering-return"
            type="number"
            min="0"
            step="0.01"
            value={expectedReturn}
            onChange={(event) => setExpectedReturn(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="offering-total" className={labelClass}>
            Total units
          </label>
          <input
            id="offering-total"
            type="number"
            min="1"
            step="1"
            value={totalUnits}
            onChange={(event) => setTotalUnits(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="offering-min" className={labelClass}>
            Minimum units per investor
          </label>
          <input
            id="offering-min"
            type="number"
            min="1"
            step="1"
            value={minUnits}
            onChange={(event) => setMinUnits(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="offering-status" className={labelClass}>
            Status
          </label>
          <select
            id="offering-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as OfferingStatus)}
            className={inputClass}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="offering-closes" className={labelClass}>
            Closes at (optional)
          </label>
          <input
            id="offering-closes"
            type="datetime-local"
            value={closesAt}
            onChange={(event) => setClosesAt(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {offering ? 'Save changes' : 'Create round'}
        </button>
      </div>
    </form>
  );
}
