import { useState, type FormEvent } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { dollarsToCents } from '@/lib/format';
import type { VehicleModel } from '@/types/models';
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from '@/components/ui/styles';

interface VehicleFormProps {
  model: VehicleModel | null;
  onSaved: () => void;
  onCancel: () => void;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function VehicleForm({ model, onSaved, onCancel }: VehicleFormProps) {
  const [name, setName] = useState(model?.name ?? '');
  const [slug, setSlug] = useState(model?.slug ?? '');
  const [tagline, setTagline] = useState(model?.tagline ?? '');
  const [description, setDescription] = useState(model?.description ?? '');
  const [imageUrl, setImageUrl] = useState(model?.image_url ?? '');
  const [price, setPrice] = useState(model ? String(model.price_cents / 100) : '');
  const [rangeMiles, setRangeMiles] = useState(model ? String(model.range_miles) : '');
  const [topSpeed, setTopSpeed] = useState(model ? String(model.top_speed_mph) : '');
  const [seats, setSeats] = useState(model ? String(model.seats) : '2');
  const [zeroToSixty, setZeroToSixty] = useState(model ? String(model.zero_to_sixty_sec) : '');
  const [isPublished, setIsPublished] = useState(model?.is_published ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!model) setSlug(slugify(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const priceValue = Number(price);
    const range = Number(rangeMiles);
    const speed = Number(topSpeed);
    const seatCount = Number(seats);
    const sprint = Number(zeroToSixty);

    if (!name.trim()) return setError('Enter a vehicle name.');
    if (!slug.trim()) return setError('Enter a web address (slug) for this vehicle.');
    if (!(priceValue > 0)) return setError('Enter a price greater than zero.');
    if (!(range >= 0) || !(speed >= 0) || !(sprint >= 0)) return setError('Specifications cannot be negative.');
    if (!Number.isInteger(seatCount) || seatCount < 1) return setError('Seats must be a whole number of at least 1.');

    const payload = {
      name: name.trim(),
      slug: slugify(slug),
      tagline: tagline.trim(),
      description: description.trim(),
      image_url: imageUrl.trim(),
      price_cents: dollarsToCents(priceValue),
      range_miles: Math.round(range),
      top_speed_mph: Math.round(speed),
      seats: seatCount,
      zero_to_sixty_sec: sprint,
      is_published: isPublished,
    };

    setSubmitting(true);
    const result = model
      ? await supabase.from('vehicle_models').update(payload).eq('id', model.id)
      : await supabase.from('vehicle_models').insert(payload);
    setSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="vehicle-name" className={labelClass}>
            Name
          </label>
          <input
            id="vehicle-name"
            type="text"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="vehicle-slug" className={labelClass}>
            Web address (slug)
          </label>
          <input
            id="vehicle-slug"
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="vehicle-tagline" className={labelClass}>
          Tagline
        </label>
        <input
          id="vehicle-tagline"
          type="text"
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="vehicle-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="vehicle-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="vehicle-image" className={labelClass}>
          Image URL
        </label>
        <input
          id="vehicle-image"
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="vehicle-price" className={labelClass}>
            Price (USD)
          </label>
          <input
            id="vehicle-price"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="vehicle-seats" className={labelClass}>
            Seats
          </label>
          <input
            id="vehicle-seats"
            type="number"
            min="1"
            step="1"
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="vehicle-range" className={labelClass}>
            Range (miles)
          </label>
          <input
            id="vehicle-range"
            type="number"
            min="0"
            step="1"
            value={rangeMiles}
            onChange={(event) => setRangeMiles(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="vehicle-speed" className={labelClass}>
            Top speed (mph)
          </label>
          <input
            id="vehicle-speed"
            type="number"
            min="0"
            step="1"
            value={topSpeed}
            onChange={(event) => setTopSpeed(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="vehicle-sprint" className={labelClass}>
            0-60 mph (seconds)
          </label>
          <input
            id="vehicle-sprint"
            type="number"
            min="0"
            step="0.1"
            value={zeroToSixty}
            onChange={(event) => setZeroToSixty(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-600"
        />
        Show this vehicle to the public
      </label>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {model ? 'Save changes' : 'Add vehicle'}
        </button>
      </div>
    </form>
  );
}
