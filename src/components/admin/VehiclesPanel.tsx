import { useEffect, useState } from 'react';
import { Loader as Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents } from '@/lib/format';
import type { VehicleModel } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass, primaryButtonClass } from '@/components/ui/styles';
import { VehicleForm } from '@/components/admin/VehicleForm';

type ModalState = { mode: 'create' } | { mode: 'edit'; model: VehicleModel } | null;

export function VehiclesPanel() {
  const [models, setModels] = useState<VehicleModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('vehicle_models')
      .select('*')
      .order('price_cents', { ascending: true })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError('We could not load vehicles. Please refresh and try again.');
          return;
        }
        setError(null);
        setModels((data ?? []) as VehicleModel[]);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const togglePublished = async (model: VehicleModel) => {
    setBusyId(model.id);
    setActionError(null);
    const { error: updateError } = await supabase
      .from('vehicle_models')
      .update({ is_published: !model.is_published })
      .eq('id', model.id);
    setBusyId(null);
    if (updateError) {
      setActionError(updateError.message);
      return;
    }
    setReloadKey((value) => value + 1);
  };

  const handleSaved = () => {
    setModal(null);
    setReloadKey((value) => value + 1);
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Vehicles</h2>
          <p className="mt-1 text-sm text-zinc-600">Manage the models shown to visitors and their specifications.</p>
        </div>
        <button type="button" onClick={() => setModal({ mode: 'create' })} className={primaryButtonClass}>
          <Plus className="h-4 w-4" />
          Add vehicle
        </button>
      </div>

      {actionError && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

      <div className="mt-8">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {!error && models === null && (
          <div className="flex justify-center py-20 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {models && models.length === 0 && (
          <div className={`${cardClass} p-10 text-center text-sm text-zinc-600`}>
            No vehicles yet. Add your first model to start taking reservations.
          </div>
        )}

        {models && models.length > 0 && (
          <div className={`${cardClass} overflow-x-auto`}>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Range</th>
                  <th className="px-5 py-3 font-medium">Visibility</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {models.map((model) => (
                  <tr key={model.id} className="transition hover:bg-zinc-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-900">{model.name}</p>
                      <p className="text-xs text-zinc-500">{model.tagline}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-700">{formatCents(model.price_cents)}</td>
                    <td className="px-5 py-4 text-zinc-700">{model.range_miles} mi</td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={model.is_published ? 'published' : 'draft'}
                        label={model.is_published ? 'Published' : 'Hidden'}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: 'edit', model })}
                          className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={busyId === model.id}
                          onClick={() => togglePublished(model)}
                          className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-300 transition hover:bg-zinc-100 disabled:opacity-50"
                        >
                          {model.is_published ? 'Hide' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'Add vehicle' : 'Edit vehicle'}
          onClose={() => setModal(null)}
        >
          <VehicleForm
            model={modal.mode === 'edit' ? modal.model : null}
            onSaved={handleSaved}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </section>
  );
}
