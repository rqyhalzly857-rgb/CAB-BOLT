import { useState } from 'react';
import { CheckCircle2, Loader2, Minus, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents } from '@/lib/format';
import { useAuth } from '@/contexts/auth-context';
import type { VehicleModel } from '@/types/models';
import { primaryButtonClass } from '@/components/ui/styles';

const MAX_QUANTITY = 10;

interface OrderPanelProps {
  model: VehicleModel;
}

export function OrderPanel({ model }: OrderPanelProps) {
  const { user, loading } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);

  const total = model.price_cents * quantity;

  const reserve = async () => {
    setSubmitting(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc('place_vehicle_order', {
      p_model_id: model.id,
      p_quantity: quantity,
    });
    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-zinc-900">Reservation received</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Your {model.name} reservation is pending review. Track its status in your dashboard.
        </p>
        <a href="#/dashboard" className={`${primaryButtonClass} mt-6 w-full`}>
          Go to my dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700">Quantity</p>
        <div className="flex items-center justify-between rounded-full border border-zinc-300 bg-white p-1">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-base font-semibold text-zinc-900" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
            disabled={quantity >= MAX_QUANTITY}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600">Total</span>
        <span className="text-base font-semibold text-zinc-900">{formatCents(total)}</span>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-3 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : user ? (
        <button type="button" onClick={reserve} disabled={submitting} className={`${primaryButtonClass} w-full`}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Reserve this vehicle
        </button>
      ) : (
        <a href="#/login" className={`${primaryButtonClass} w-full`}>
          Sign in to reserve
        </a>
      )}

      <p className="text-xs leading-relaxed text-zinc-500">
        Reserving does not charge your card. Our team will contact you to confirm delivery details.
      </p>
    </div>
  );
}
