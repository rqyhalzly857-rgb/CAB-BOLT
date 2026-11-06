import { formatCents, formatDate } from '@/lib/format';
import type { GrowthPoint } from '@/lib/growth';

interface GrowthChartProps {
  points: GrowthPoint[];
}

const WIDTH = 640;
const HEIGHT = 240;

export function GrowthChart({ points }: GrowthChartProps) {
  if (points.length < 2) {
    return (
      <p className="py-12 text-center text-sm leading-[1.5] text-zinc-600">
        Your growth chart will appear here once you have at least one confirmed investment.
      </p>
    );
  }

  const first = points[0];
  const last = points[points.length - 1];
  const span = Math.max(1, last.time - first.time);
  const maxValue = Math.max(1, ...points.map((point) => point.value)) * 1.08;

  const x = (time: number) => ((time - first.time) / span) * WIDTH;
  const y = (cents: number) => HEIGHT - (cents / maxValue) * HEIGHT;

  const valueLine = points.map((point) => `${x(point.time).toFixed(1)},${y(point.value).toFixed(1)}`).join(' ');
  const investedLine = points
    .flatMap((point, index) => {
      const current = `${x(point.time).toFixed(1)},${y(point.invested).toFixed(1)}`;
      if (index === 0) return [current];
      const previous = points[index - 1];
      return [`${x(point.time).toFixed(1)},${y(previous.invested).toFixed(1)}`, current];
    })
    .join(' ');
  const areaPath = `M ${valueLine.split(' ')[0]} L ${valueLine.split(' ').slice(1).join(' ')} L ${WIDTH},${HEIGHT} L 0,${HEIGHT} Z`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <p className="text-zinc-500">Projected value today</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{formatCents(last.value)}</p>
        </div>
        <div>
          <p className="text-zinc-500">Total invested</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-500">{formatCents(last.invested)}</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-64 w-full overflow-visible" role="img" aria-label="Investment growth chart">
        <defs>
          <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2={WIDTH}
            y1={HEIGHT * ratio}
            y2={HEIGHT * ratio}
            stroke="#e4e4e7"
            strokeDasharray="4 6"
          />
        ))}
        <path d={areaPath} fill="url(#growth-fill)" />
        <polyline
          points={investedLine}
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinejoin="round"
        />
        <polyline points={valueLine} fill="none" stroke="#0284c7" strokeWidth="3" strokeLinejoin="round" />
        {points.map((point) => (
          <circle
            key={point.time}
            cx={x(point.time)}
            cy={y(point.value)}
            r="4"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <span>{formatDate(new Date(first.time).toISOString())}</span>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-sky-600" />
            Projected value
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 border-t-2 border-dashed border-zinc-400" />
            Invested
          </span>
        </div>
        <span>{formatDate(new Date(last.time).toISOString())}</span>
      </div>
      <p className="mt-6 text-xs leading-[1.5] text-zinc-500">
        Projected values assume each position grows at its expected annual return. They are estimates, not guaranteed.
      </p>
    </div>
  );
}
