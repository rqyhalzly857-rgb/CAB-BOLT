import type { VehicleOrder } from '@/types/models';
import { formatCents, formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass } from '@/components/ui/styles';

interface OrdersListProps {
  orders: VehicleOrder[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className={`${cardClass} p-8 text-center text-sm leading-relaxed text-zinc-600`}>
        No vehicle reservations yet. Reserve a Roadster or Cybercab and track it here.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id} className={`${cardClass} flex gap-4 p-4 sm:p-5`}>
          {order.vehicle_models?.image_url && (
            <img
              src={order.vehicle_models.image_url}
              alt=""
              aria-hidden="true"
              className="h-20 w-28 shrink-0 rounded-xl object-cover"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-zinc-900">{order.vehicle_models?.name ?? 'Vehicle'}</p>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>
                {order.quantity} {order.quantity === 1 ? 'vehicle' : 'vehicles'} · {formatDate(order.created_at)}
              </span>
              <span className="font-semibold text-zinc-900">{formatCents(order.total_cents)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
