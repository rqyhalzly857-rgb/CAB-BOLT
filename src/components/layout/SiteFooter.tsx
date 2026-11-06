import { Car } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#/" className="flex items-center gap-2.5 text-zinc-900 transition duration-200 hover:opacity-80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <Car className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">Voltway</span>
            </a>
            <p className="mt-4 text-sm leading-[1.5] text-zinc-600">
              Buy or fund the next generation of electric mobility, from open-air roadsters to autonomous city fleets.
            </p>
          </div>
          <div className="flex gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-zinc-900">Explore</span>
              <a href="#/vehicles" className="text-zinc-600 transition duration-200 hover:text-zinc-900">Vehicles</a>
              <a href="#/invest" className="text-zinc-600 transition duration-200 hover:text-zinc-900">Investment offerings</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-zinc-900">Account</span>
              <a href="#/login" className="text-zinc-600 transition duration-200 hover:text-zinc-900">Sign in</a>
              <a href="#/signup" className="text-zinc-600 transition duration-200 hover:text-zinc-900">Create account</a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-200 pt-6 text-xs leading-[1.5] text-zinc-500">
          <p>
            Voltway is a demonstration platform. Vehicle specifications, prices and offering terms shown here are illustrative
            and do not constitute an offer to sell or a solicitation to invest. Investing involves risk, including possible loss
            of the amount invested. Past or projected returns are not guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}
