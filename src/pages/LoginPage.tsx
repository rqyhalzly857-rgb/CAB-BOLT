import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Car, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { navigate } from '@/lib/router';
import { inputClass, labelClass, primaryButtonClass } from '@/components/ui/styles';

type LoginMode = 'investor' | 'signup' | 'admin';

interface LoginPageProps {
  mode: LoginMode;
}

const copy: Record<LoginMode, { title: string; subtitle: string; submit: string }> = {
  investor: {
    title: 'Welcome back',
    subtitle: 'Sign in to manage your orders and investments.',
    submit: 'Sign in',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Join Voltway to reserve vehicles and invest in fleet rounds.',
    submit: 'Create account',
  },
  admin: {
    title: 'Admin sign in',
    subtitle: 'Restricted to Voltway administrators.',
    submit: 'Sign in to admin',
  },
};

export function LoginPage({ mode }: LoginPageProps) {
  const { user, loading, signIn, signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = mode === 'admin' ? '/admin' : '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      navigate(destination);
    }
  }, [loading, user, destination]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError('Enter your full name.');
      return;
    }

    setSubmitting(true);
    const result =
      mode === 'signup'
        ? await signUp(trimmedEmail, password, fullName.trim())
        : await signIn(trimmedEmail, password);
    setSubmitting(false);

    if (result) {
      setError(result);
    }
  };

  const content = copy[mode];
  const isSignup = mode === 'signup';

  return (
    <div className="grid min-h-screen bg-zinc-50 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-zinc-950 text-white lg:block">
        <img
          src="https://images.pexels.com/photos/35076211/pexels-photo-35076211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <a href="#/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-900">
              <Car className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Voltway</span>
          </a>
          <div className="max-w-md">
            <p className="text-3xl font-semibold leading-snug">
              Electric mobility, owned or funded by people like you.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>

          <div className="mt-10 flex items-center gap-3">
            {mode === 'admin' && (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
            )}
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{content.title}</h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">{content.subtitle}</p>

          {mode !== 'admin' && (
            <div className="mt-8 grid grid-cols-2 rounded-full bg-zinc-200/70 p-1 text-sm font-medium">
              <a
                href="#/login"
                className={`rounded-full px-4 py-2 text-center transition ${
                  !isSignup ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Sign in
              </a>
              <a
                href="#/signup"
                className={`rounded-full px-4 py-2 text-center transition ${
                  isSignup ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Create account
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {isSignup && (
              <div>
                <label htmlFor="full-name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="full-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClass}
                  placeholder="Alex Morgan"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {content.submit}
            </button>
          </form>

          {mode === 'investor' && (
            <p className="mt-8 text-center text-sm text-zinc-600">
              New to Voltway?{' '}
              <a href="#/signup" className="font-semibold text-sky-700 hover:text-sky-800">
                Create an account
              </a>
            </p>
          )}
          {mode === 'admin' && (
            <p className="mt-8 text-center text-sm text-zinc-600">
              Not an administrator?{' '}
              <a href="#/login" className="font-semibold text-sky-700 hover:text-sky-800">
                Investor sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
