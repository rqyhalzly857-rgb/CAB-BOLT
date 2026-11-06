import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/models';
import { AuthContext, type AuthContextValue } from '@/contexts/auth-context';

function friendlyAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Email or password is incorrect.';
  if (message.includes('already registered')) return 'An account with this email already exists.';
  if (message.includes('Password should be')) return 'Password must be at least 6 characters.';
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async (userId: string | undefined) => {
      if (!userId) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (!active) return;
      if (error) {
        console.error('Could not load profile', error.message);
        setProfile(null);
        return;
      }
      setProfile((data as Profile | null) ?? null);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      (async () => {
        if (!active) return;
        setSession(nextSession);
        await loadProfile(nextSession?.user.id);
        if (active) setLoading(false);
      })();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? friendlyAuthError(error.message) : null;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return error ? friendlyAuthError(error.message) : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const user: User | null = session?.user ?? null;
  const userId = user?.id;

  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      console.error('Could not refresh profile', error.message);
      return;
    }
    setProfile((data as Profile | null) ?? null);
  }, [userId]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, user, profile, loading, signIn, signUp, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
