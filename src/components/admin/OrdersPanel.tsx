import { useEffect, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents, formatDate } from '@/lib/format';
import type { OrderStatus, VehicleOrder } from '@/types/models';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass, inputClass } from '@/components/ui/styles';

const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'delivered', 'cancelled'];

export function OrdersPanel() {
  const [orders, setOrders] = useState<VehicleOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('orders')
      .select('*, vehicle_models(name, image_url, slug), profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError('We could not load orders. Please refresh and try again.');
          return;
        }
        setError(null);
        setOrders((data ?? []) as VehicleOrder[]);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const changeStatus = async (order: VehicleOrder, status: OrderStatus) => {
    setBusyId(order.id);
    setActionError(null);
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', order.id);
    setBusyId(null);
    if (updateError) {
      setActionError(updateError.message);
      return;
    }
    setReloadKey((value) => value + 1);
  };

  return (
    <section>
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Vehicle orders</h2>
        <p className="mt-1 text-sm text-zinc-600">Review reservations and move them through confirmation and delivery.</p>
      </div>

      {actionError && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

      <div className="mt-8">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {!error && orders === null && (
          <div className="flex justify-center py-20 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className={`${cardClass} p-10 text-center text-sm text-zinc-600`}>No vehicle orders yet.</div>
        )}

        {orders && orders.length > 0 && (
          <div className={`${cardClass} overflow-x-auto`}>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Quantity</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Placed</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-zinc-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-900">{order.profiles?.full_name || 'Unnamed'}</p>
                      <p className="text-xs text-zinc-500">{order.profiles?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-700">{order.vehicle_models?.name ?? 'Vehicle'}</td>
                    <td className="px-5 py-4 text-zinc-700">{order.quantity}</td>
                    <td className="px-5 py-4 text-zinc-700">{formatCents(order.total_cents)}</td>
                    <td className="px-5 py-4 text-zinc-700">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          aria-label={`Status for order from ${order.profiles?.email ?? 'customer'}`}
                          value={order.status}
                          disabled={busyId === order.id}
                          onChange={(event) => changeStatus(order, event.target.value as OrderStatus)}
                          className={`${inputClass} w-auto py-2 pr-8`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <StatusBadge status={order.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
