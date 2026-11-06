const toneClasses: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  sky: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  zinc: 'bg-zinc-100 text-zinc-700 ring-zinc-500/20',
};

const statusTone: Record<string, keyof typeof toneClasses> = {
  open: 'green',
  confirmed: 'green',
  delivered: 'sky',
  published: 'green',
  pending: 'amber',
  draft: 'zinc',
  closed: 'zinc',
  cancelled: 'red',
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const tone = toneClasses[statusTone[status] ?? 'zinc'];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${tone}`}
    >
      {label ?? status}
    </span>
  );
}
