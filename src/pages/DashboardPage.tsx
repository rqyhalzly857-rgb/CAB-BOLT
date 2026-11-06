import { useEffect, useState } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import type { Investment, VehicleOrder } from '@/types/models';
import { buildGrowthSeries, buildPositionReturns } from '@/lib/growth';
import { RequireSignIn } from '@/components/layout/RequireSignIn';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { InvestmentsList } from '@/components/dashboard/InvestmentsList';
import { OrdersList } from '@/components/dashboard/OrdersList';
import { GrowthChart } from '@/components/dashboard/GrowthChart';
import { ReturnsTable } from '@/components/dashboard/ReturnsTable';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { OpportunitiesPanel } from '@/components/dashboard/OpportunitiesPanel';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { StatementsPanel } from '@/components/dashboard/StatementsPanel';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { dashboardSections, type DashboardSectionId } from '@/lib/dashboard-sections';
import { cardClass } from '@/components/ui/styles';

interface DashboardData {
  investments: Investment[];
  orders: VehicleOrder[];
}

interface DashboardPageProps {
  section?: string;
}

function resolveSection(section: string | undefined): DashboardSectionId {
  return dashboardSections.find((item) => item.id === section)?.id ?? 'overview';
}

export function DashboardPage({ section }: DashboardPageProps) {
  return (
    <RequireSignIn message="Sign in to see your investments, growth, orders and profile.">
      <DashboardContent active={resolveSection(section)} />
    </RequireSignIn>
  );
}

function DashboardContent({ active }: { active: DashboardSectionId }) {
  const { user, profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    (async () => {
      const [investmentsResult, ordersResult] = await Promise.all([
        supabase
          .from('investments')
          .select('*, investment_offerings(title, unit_price_cents, expected_annual_return_pct, vehicle_models(name))')
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('*, vehicle_models(name, image_url, slug)')
          .order('created_at', { ascending: false }),
      ]);
      if (!isMounted) return;
      if (investmentsResult.error || ordersResult.error) {
        setError('We could not load your dashboard. Please refresh and try again.');
        return;
      }
      setData({
        investments: (investmentsResult.data ?? []) as Investment[],
        orders: (ordersResult.data ?? []) as VehicleOrder[],
      });
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const firstName = (profile?.full_name || user?.email || '').split(/[\s@]/)[0];
  const sectionLabel = dashboardSections.find((item) => item.id === active)?.label ?? 'Overview';

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div>
        <p className="text-sm font-medium tracking-wide text-sky-700">My dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Welcome back{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{user?.email}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <DashboardNav active={active} />

        <div className="min-w-0">
          <h2 className="mb-6 text-xl font-semibold text-zinc-900">{sectionLabel}</h2>

          {active === 'overview' && (
            <div className="space-y-8">
              <PortfolioSummary investments={data.investments} orders={data.orders} />
              <div className={`${cardClass} p-6 sm:p-8`}>
                <h3 className="mb-6 text-base font-semibold text-zinc-900">Investment growth</h3>
                <GrowthChart points={buildGrowthSeries(data.investments)} />
              </div>
            </div>
          )}

          {active === 'opportunities' && (
            <div className="space-y-6">
              <p className="text-sm text-zinc-600">Open investment rounds you can fund today.</p>
              <OpportunitiesPanel />
            </div>
          )}

          {active === 'investments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600">Every round you have funded, with the amount and status.</p>
                <a href="#/invest" className="shrink-0 text-sm font-semibold text-sky-700 hover:text-sky-800">
                  Browse rounds
                </a>
              </div>
              <InvestmentsList investments={data.investments} />
            </div>
          )}

          {active === 'returns' && <ReturnsTable positions={buildPositionReturns(data.investments)} />}

          {active === 'activity' && (
            <div className="space-y-6">
              <p className="text-sm text-zinc-600">A chronological record of your investments and reservations.</p>
              <ActivityTimeline investments={data.investments} orders={data.orders} />
            </div>
          )}

          {active === 'statements' && <StatementsPanel investments={data.investments} orders={data.orders} />}

          {active === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600">Your vehicle reservations and their current status.</p>
                <a href="#/vehicles" className="shrink-0 text-sm font-semibold text-sky-700 hover:text-sky-800">
                  Browse vehicles
                </a>
              </div>
              <OrdersList orders={data.orders} />
            </div>
          )}

          {active === 'profile' && <ProfileForm />}
        </div>
      </div>
    </div>
  );
}
