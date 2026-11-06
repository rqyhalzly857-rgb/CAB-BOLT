import { useEffect, useState } from 'react';
import { Loader as Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCents, formatPercent } from '@/lib/format';
import type { InvestmentOffering, OfferingStatus } from '@/types/models';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cardClass, primaryButtonClass } from '@/components/ui/styles';
import { OfferingForm, type ModelOption } from '@/components/admin/OfferingForm';

type ModalState = { mode: 'create' } | { mode: 'edit'; offering: InvestmentOffering } | null;

export function OfferingsPanel() {
  const [offerings, setOfferings] = useState<InvestmentOffering[] | null>(null);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [offeringsResult, modelsResult] = await Promise.all([
        supabase
          .from('investment_offerings')
          .select('*, vehicle_models(name, image_url, slug)')
          .order('created_at', { ascending: false }),
        supabase.from('vehicle_models').select('id, name').order('name'),
      ]);
      if (!active) return;
      if (offeringsResult.error || modelsResult.error) {
        setError('We could not load investment rounds. Please refresh and try again.');
        return;
      }
      setError(null);
      setOfferings((offeringsResult.data ?? []) as InvestmentOffering[]);
      setModels((modelsResult.data ?? []) as ModelOption[]);
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const changeStatus = async (offering: InvestmentOffering, status: OfferingStatus) => {
    setBusyId(offering.id);
    setActionError(null);
    const { error: updateError } = await supabase
      .from('investment_offerings')
      .update({ status })
      .eq('id', offering.id);
    setBusyId(null);
    if (updateError) {
      setActionError(updateError.message);
      return;
    }
    setReloadKey((value) => value + 1);
  };

  const closeModal = () => setModal(null);

  const handleSaved = () => {
    setModal(null);
    setReloadKey((value) => value + 1);
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Investment rounds</h2>
          <p className="mt-1 text-sm text-zinc-600">Create rounds, open them to investors and close them when funded.</p>
        </div>
        <button type="button" onClick={() => setModal({ mode: 'create' })} className={primaryButtonClass}>
          <Plus className="h-4 w-4" />
          New round
        </button>
      </div>

      {actionError && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

      <div className="mt-8">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {!error && offerings === null && (
          <div className="flex justify-center py-20 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {offerings && offerings.length === 0 && (
          <div className={`${cardClass} p-10 text-center text-sm text-zinc-600`}>
            No investment rounds yet. Create your first round to start raising funds.
          </div>
        )}

        {offerings && offerings.length > 0 && (
          <div className={`${cardClass} overflow-x-auto`}>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Round</th>
                  <th className="px-5 py-3 font-medium">Unit price</th>
                  <th className="px-5 py-3 font-medium">Sold</th>
                  <th className="px-5 py-3 font-medium">Return</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {offerings.map((offering) => (
                  <tr key={offering.id} className="transition hover:bg-zinc-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-900">{offering.title}</p>
                      <p className="text-xs text-zinc-500">{offering.vehicle_models?.name ?? 'Vehicle'}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-700">{formatCents(offering.unit_price_cents)}</td>
                    <td className="px-5 py-4 text-zinc-700">
                      {offering.units_sold} / {offering.total_units}
                    </td>
                    <td className="px-5 py-4 text-zinc-700">{formatPercent(offering.expected_annual_return_pct)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={offering.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: 'edit', offering })}
                          className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Edit
                        </button>
                        {offering.status === 'open' ? (
                          <button
                            type="button"
                            disabled={busyId === offering.id}
                            onClick={() => changeStatus(offering, 'closed')}
                            className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-300 transition hover:bg-zinc-100 disabled:opacity-50"
                          >
                            Close
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyId === offering.id}
                            onClick={() => changeStatus(offering, 'open')}
                            className="rounded-full bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
                          >
                            Open
                          </button>
                        )}
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
          title={modal.mode === 'create' ? 'New investment round' : 'Edit investment round'}
          onClose={closeModal}
        >
          <OfferingForm
            offering={modal.mode === 'edit' ? modal.offering : null}
            models={models}
            onSaved={handleSaved}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </section>
  );
}
