import { Package, Wallet } from 'lucide-react';
import type { Investment, VehicleOrder } from '@/types/models';
import { formatCents, formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass } from '@/components/ui/styles';

interface ActivityTimelineProps {
  investments: Investment[];
  orders: VehicleOrder[];
}

interface ActivityItem {
  id: string;
  createdAt: string;
  kind: 'investment' | 'order';
  title: string;
  detail: string;
  amountCents: number;
  status: string;
}

export function ActivityTimeline({ investments, orders }: ActivityTimelineProps) {
  const items: ActivityItem[] = [
    ...investments.map((item) => ({
      id: `investment-${item.id}`,
      createdAt: item.created_at,
      kind: 'investment' as const,
      title: `Invested in ${item.investment_offerings?.title ?? 'an investment round'}`,
      detail: `${item.units} ${item.units === 1 ? 'unit' : 'units'}`,
      amountCents: item.amount_cents,
      status: item.status,
    })),
    ...orders.map((order) => ({
      id: `order-${order.id}`,
      createdAt: order.created_at,
      kind: 'order' as const,
      title: `Reserved ${order.vehicle_models?.name ?? 'a vehicle'}`,
      detail: `${order.quantity} ${order.quantity === 1 ? 'vehicle' : 'vehicles'}`,
      amountCents: order.total_cents,
      status: order.status,
    })),
  ].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  if (items.length === 0) {
    return (
      <div className={`${cardClass} p-8 text-center text-sm leading-relaxed text-zinc-600`}>
        Your investment and reservation activity will appear here as it happens.
      </div>
    );
  }

  return (
    <ol className={`${cardClass} divide-y divide-zinc-200 overflow-hidden`}>
      {items.map((item) => {
        const Icon = item.kind === 'investment' ? Wallet : Package;
        return (
          <li key={item.id} className="flex gap-4 p-5 sm:p-6">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
              <Icon className="h-4 w-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {item.detail} · {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <span className="font-semibold text-zinc-900">{formatCents(item.amountCents)}</span>
                <StatusBadge status={item.status} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
