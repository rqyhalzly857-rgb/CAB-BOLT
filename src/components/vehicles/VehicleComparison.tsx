import { formatCents } from '@/lib/format';
import type { VehicleModel } from '@/types/models';
import { cardClass } from '@/components/ui/styles';

interface VehicleComparisonProps {
  models: VehicleModel[];
}

const rows: { label: string; value: (model: VehicleModel) => string }[] = [
  { label: 'Starting price', value: (model) => formatCents(model.price_cents) },
  { label: 'Range', value: (model) => `${model.range_miles} mi` },
  { label: 'Top speed', value: (model) => `${model.top_speed_mph} mph` },
  { label: '0-60 mph', value: (model) => `${model.zero_to_sixty_sec}s` },
  { label: 'Seats', value: (model) => String(model.seats) },
];

export function VehicleComparison({ models }: VehicleComparisonProps) {
  return (
    <section className="mt-24">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Compare models</h2>
      <p className="mt-2 text-sm text-zinc-600">Specifications side by side.</p>
      <div className={`${cardClass} mt-8 overflow-x-auto`}>
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-zinc-500">
                Specification
              </th>
              {models.map((model) => (
                <th key={model.id} scope="col" className="px-6 py-4 font-semibold text-zinc-900">
                  <a href={`#/vehicles/${model.slug}`} className="transition hover:text-sky-700">
                    {model.name}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={row.label} className="transition hover:bg-zinc-50">
                <th scope="row" className="px-6 py-4 text-left font-medium text-zinc-600">
                  {row.label}
                </th>
                {models.map((model) => (
                  <td key={model.id} className="px-6 py-4 text-zinc-900">
                    {row.value(model)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
