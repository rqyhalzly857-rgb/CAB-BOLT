import { useState } from 'react';
import { BarChart3, Car, Layers, Loader2, LogOut, Package, ShieldAlert, Users } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { OverviewPanel } from '@/components/admin/OverviewPanel';
import { OfferingsPanel } from '@/components/admin/OfferingsPanel';
import { VehiclesPanel } from '@/components/admin/VehiclesPanel';
import { OrdersPanel } from '@/components/admin/OrdersPanel';
import { InvestmentsPanel } from '@/components/admin/InvestmentsPanel';
import { cardClass, primaryButtonClass, secondaryButtonClass } from '@/components/ui/styles';

type AdminTab = 'overview' | 'offerings' | 'vehicles' | 'orders' | 'investments';

const tabs: { id: AdminTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'offerings', label: 'Investment rounds', icon: Layers },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'investments', label: 'Investments', icon: Users },
];

export function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
        <div className={`${cardClass} w-full p-10`}>
          <h1 className="text-2xl font-semibold text-zinc-900">Admin access</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">Sign in with an administrator account to continue.</p>
          <a href="#/admin/login" className={`${primaryButtonClass} mt-8 w-full`}>
            Go to admin sign in
          </a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
        <div className={`${cardClass} w-full p-10`}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <h1 className="mt-6 text-2xl font-semibold text-zinc-900">Access denied</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            This account does not have administrator permissions.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a href="#/dashboard" className={primaryButtonClass}>
              Go to my dashboard
            </a>
            <button type="button" onClick={() => signOut()} className={secondaryButtonClass}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Administration</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Admin dashboard</h1>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Admin sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === id ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:text-zinc-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-10">
        {tab === 'overview' && <OverviewPanel />}
        {tab === 'offerings' && <OfferingsPanel />}
        {tab === 'vehicles' && <VehiclesPanel />}
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'investments' && <InvestmentsPanel />}
      </div>

      <div className="mt-16 flex justify-end">
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
