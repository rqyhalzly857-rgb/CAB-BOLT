import type { ReactNode } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cardClass, primaryButtonClass } from '@/components/ui/styles';

interface RequireSignInProps {
  children: ReactNode;
  message?: string;
}

export function RequireSignIn({ children, message = 'Sign in to view this page.' }: RequireSignInProps) {
  const { user, loading } = useAuth();

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
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <LogIn className="h-7 w-7" />
          </span>
          <h1 className="mt-6 text-2xl font-semibold text-zinc-900">Sign in required</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{message}</p>
          <a href="#/login" className={`${primaryButtonClass} mt-8 w-full`}>
            Sign in to continue
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
