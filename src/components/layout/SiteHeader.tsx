import { useState } from 'react';
import { Car, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface NavItem {
  href: string;
  label: string;
  match: string;
}

const publicLinks: NavItem[] = [
  { href: '#/vehicles', label: 'Vehicles', match: '/vehicles' },
  { href: '#/invest', label: 'Invest', match: '/invest' },
];

interface SiteHeaderProps {
  path: string;
}

export function SiteHeader({ path }: SiteHeaderProps) {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const links: NavItem[] = [
    ...publicLinks,
    ...(user ? [{ href: '#/dashboard', label: 'My dashboard', match: '/dashboard' }] : []),
    ...(isAdmin ? [{ href: '#/admin', label: 'Admin', match: '/admin' }] : []),
  ];

  const isActive = (item: NavItem) => path === item.match || path.startsWith(`${item.match}/`);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    window.location.hash = '/';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#/" className="flex items-center gap-2.5 text-zinc-900 transition duration-200 hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <Car className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">Voltway</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                isActive(item)
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition duration-200 hover:border-zinc-400 hover:bg-zinc-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          ) : (
            <>
              <a
                href="#/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition duration-200 hover:bg-zinc-100"
              >
                Sign in
              </a>
              <a
                href="#/signup"
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800 active:scale-[0.98]"
              >
                Create account
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-zinc-200 bg-white px-5 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive(item) ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-zinc-300 px-4 py-3 text-center text-sm font-semibold text-zinc-800"
              >
                Sign out
              </button>
            ) : (
              <>
                <a
                  href="#/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-zinc-300 px-4 py-3 text-center text-sm font-semibold text-zinc-800"
                >
                  Sign in
                </a>
                <a
                  href="#/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Create account
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
