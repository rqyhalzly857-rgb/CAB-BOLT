import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthProvider';
import { useRoute } from '@/lib/router';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HomePage } from '@/pages/HomePage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { VehicleDetailPage } from '@/pages/VehicleDetailPage';
import { InvestPage } from '@/pages/InvestPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';

function renderPage(path: string) {
  const segments = path.split('/').filter(Boolean);
  const [first, second] = segments;

  if (!first) return <HomePage />;
  if (first === 'vehicles' && second) return <VehicleDetailPage slug={second} />;
  if (first === 'vehicles') return <VehiclesPage />;
  if (first === 'invest') return <InvestPage />;
  if (first === 'login') return <LoginPage mode="investor" />;
  if (first === 'signup') return <LoginPage mode="signup" />;
  if (first === 'dashboard') return <DashboardPage section={second} />;
  if (first === 'admin' && second === 'login') return <LoginPage mode="admin" />;
  if (first === 'admin') return <AdminPage />;

  return (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">Page not found</h1>
      <p className="mt-3 text-sm text-zinc-600">The page you are looking for does not exist.</p>
      <a href="#/" className="mt-8 inline-block rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white">
        Back to home
      </a>
    </div>
  );
}

function AppShell() {
  const path = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  const isAuthPage = ['/login', '/signup', '/admin/login'].includes(path);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      {!isAuthPage && <SiteHeader path={path} />}
      <main className="flex-1">{renderPage(path)}</main>
      {!isAuthPage && <SiteFooter />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
