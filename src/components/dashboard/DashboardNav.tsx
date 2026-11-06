import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { dashboardSections, type DashboardSectionId } from '@/lib/dashboard-sections';

interface DashboardNavProps {
  active: DashboardSectionId;
}

function NavLinks({ active, onNavigate }: { active: DashboardSectionId; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {dashboardSections.map(({ id, label, icon: Icon }) => {
        const isActive = id === active;
        return (
          <li key={id}>
            <a
              href={`#/dashboard/${id}`}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isActive ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardNav({ active }: DashboardNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeLabel = dashboardSections.find((item) => item.id === active)?.label ?? '';

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-zinc-200 lg:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="dashboard-mobile-menu"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Dashboard</p>
          <p className="truncate text-sm font-semibold text-zinc-900">{activeLabel}</p>
        </div>
      </div>

      <div className="lg:hidden" aria-hidden={!open}>
        <div
          onClick={closeMenu}
          className={`fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />
        <div
          id="dashboard-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
          className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out ${
            open ? 'visible translate-x-0' : 'invisible -translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <p className="text-sm font-semibold text-zinc-900">Dashboard</p>
            <button
              ref={closeRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="rounded-full p-2 text-zinc-500 transition duration-200 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Dashboard sections" className="flex-1 overflow-y-auto p-4">
            <NavLinks active={active} onNavigate={closeMenu} />
          </nav>
        </div>
      </div>

      <nav aria-label="Dashboard sections" className="hidden lg:block">
        <NavLinks active={active} />
      </nav>
    </>
  );
}
