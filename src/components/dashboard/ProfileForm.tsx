import { useState, type FormEvent } from 'react';
import { Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { cardClass, inputClass, labelClass, primaryButtonClass } from '@/components/ui/styles';

export function ProfileForm() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const trimmed = fullName.trim();
  const unchanged = trimmed === (profile?.full_name ?? '');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    if (!trimmed) {
      setMessage({ tone: 'error', text: 'Enter your full name.' });
      return;
    }
    if (!user) return;

    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: trimmed }).eq('id', user.id);
    if (error) {
      setSaving(false);
      setMessage({ tone: 'error', text: error.message });
      return;
    }
    await refreshProfile();
    setSaving(false);
    setMessage({ tone: 'success', text: 'Your profile has been updated.' });
  };

  return (
    <div className={`${cardClass} max-w-xl p-6 sm:p-8`}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="profile-name" className={labelClass}>
            Full name
          </label>
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="profile-email" className={labelClass}>
            Email
          </label>
          <input id="profile-email" type="email" value={user?.email ?? ''} disabled className={inputClass} />
        </div>
        <div>
          <p className={labelClass}>Account type</p>
          <p className="text-sm text-zinc-700">{profile?.role === 'admin' ? 'Administrator' : 'Investor'}</p>
        </div>

        {message && (
          <p
            role="status"
            className={`rounded-xl px-4 py-3 text-sm ${
              message.tone === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </p>
        )}

        <button type="submit" disabled={saving || unchanged} className={primaryButtonClass}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </button>
      </form>
    </div>
  );
}
