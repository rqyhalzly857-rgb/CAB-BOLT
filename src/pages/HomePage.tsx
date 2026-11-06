import { ArrowRight, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { primaryButtonClass, secondaryButtonClass, cardClass } from '@/components/ui/styles';
import { VehicleLineup } from '@/components/home/VehicleLineup';

const features = [
  {
    icon: Zap,
    title: 'Electric by design',
    body: 'Instant torque, quiet cabins and charging that fits into everyday life.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent offerings',
    body: 'Every investment round lists its unit price, units left and terms before you commit.',
  },
  {
    icon: TrendingUp,
    title: 'Invest alongside growth',
    body: 'Fund production runs and fleets, then follow your position from a personal dashboard.',
  },
];

const steps = [
  { title: 'Create your account', body: 'Sign up in under a minute with your email address.' },
  { title: 'Choose a vehicle or round', body: 'Reserve a vehicle to buy, or invest units in an open fleet round.' },
  { title: 'Track everything', body: 'Your dashboard shows your orders, investments and expected returns.' },
];

export function HomePage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Tesla_Cybercab_-_San_Francisco_-_June_2026.jpg"
          alt="Tesla Cybercab driving down Harrison Street in San Francisco"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />
        <p className="absolute bottom-3 right-5 text-[11px] text-zinc-300">
          Photo: 9yz, CC BY 4.0, via Wikimedia Commons
        </p>
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
          <span className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-sky-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            Voltway Mobility
          </span>
          <h1 className="animate-fade-up mt-6 max-w-3xl text-5xl font-semibold leading-[1.1] tracking-tight [animation-delay:80ms] sm:text-6xl lg:text-7xl">
            Own the future of electric mobility.
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-base leading-[1.5] text-zinc-200 [animation-delay:160ms] sm:text-lg">
            Reserve a Roadster or Cybercab, or invest in fleet rounds that put autonomous cabs on city streets. Simple
            ordering, transparent terms and a dashboard for every position you hold.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <a href="#/vehicles" className={primaryButtonClass}>
              Explore vehicles
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#/invest"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              Invest in Cybercab fleets
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-sky-700">The lineup</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Roadster and Cybercab
            </h2>
            <p className="mt-4 text-base leading-[1.5] text-zinc-600">
              Reserve a vehicle for yourself, or see how each model compares before you decide.
            </p>
          </div>
          <a
            href="#/vehicles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition duration-200 hover:gap-3 hover:text-sky-800"
          >
            Compare all vehicles
          </a>
        </div>
        <div className="mt-12">
          <VehicleLineup />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-sky-700">Why Voltway</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Built for owners and investors
          </h2>
          <p className="mt-4 text-base leading-[1.5] text-zinc-600">
            Whether you want to drive one home or back a fleet, Voltway keeps the process clear from first click to final
            statement.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className={`${cardClass} group p-8 transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition duration-300 group-hover:bg-sky-600 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-zinc-900">{title}</h3>
              <p className="mt-2 text-sm leading-[1.5] text-zinc-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium tracking-wide text-sky-700">Getting started</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">How it works</h2>
            <ol className="mt-10 space-y-8">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-zinc-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-[1.5] text-zinc-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className={`${cardClass} flex flex-col gap-6 bg-zinc-900 p-8 text-white sm:p-10`}>
            <p className="text-sm font-medium tracking-wide text-sky-300">Ready when you are</p>
            <h3 className="text-2xl font-semibold leading-snug">
              Start with an account and see every open offering in one place.
            </h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#/signup" className={primaryButtonClass}>
                Create account
              </a>
              <a
                href="#/vehicles"
                className={`${secondaryButtonClass} border-white/20 bg-transparent text-white hover:bg-white/10`}
              >
                Browse vehicles
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
