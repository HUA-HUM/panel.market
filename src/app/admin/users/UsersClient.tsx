'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/src/features/auth/components/AuthProvider';

type UserRole = 'admin' | 'operator' | 'viewer';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'operator' as UserRole,
  isActive: true,
};

export default function UsersClient() {
  const { session, user } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedUser, setLastCreatedUser] = useState<null | {
    name: string;
    email: string;
    role: UserRole;
  }>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.accessToken) {
      toast.error('No active session available.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/internal/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(form),
      });

      const rawMessage = await response.text();
      let message = 'User created successfully.';

      if (rawMessage) {
        try {
          const parsed = JSON.parse(rawMessage) as { message?: string };
          message = parsed.message ?? message;
        } catch {
          message = rawMessage;
        }
      }

      if (!response.ok) {
        throw new Error(message);
      }

      setLastCreatedUser({
        name: form.name,
        email: form.email,
        role: form.role,
      });
      setForm(INITIAL_FORM);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create the user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen w-full px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-red-500/20 bg-red-500/10 p-8 text-red-100 shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-red-200/80">
            Restricted
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            You do not have access to user management
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100/80">
            Only admin users can create new accounts from this section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-6 py-10">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
            Access Control
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Users
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-400">
            Create panel accounts from a dedicated admin area. Passwords are hashed server-side and sent securely to madre-api.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,32,0.96),rgba(8,12,22,0.98))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
                  New account
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Create user
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                Admin only
              </span>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  placeholder="Nuevo Usuario"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  placeholder="nuevo@empresa.com"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Password
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  required
                  minLength={8}
                  placeholder="MiPassword.2026"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Role
                </span>
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, role: event.target.value as UserRole }))
                  }
                  className="rounded-2xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="admin">admin</option>
                  <option value="operator">operator</option>
                  <option value="viewer">viewer</option>
                </select>
              </label>

              <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isActive: event.target.checked }))
                  }
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-400/20"
                />
                Create as active user
              </label>

              <div className="md:col-span-2 mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating user...' : 'Create user'}
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
                Flow
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                How this works
              </h3>
              <div className="mt-5 space-y-4 text-sm text-zinc-400">
                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  1. You complete the user data from this admin section.
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  2. The frontend hashes the password on the server, never in the browser.
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  3. The server sends the final payload to madre-api using the internal API key.
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,30,0.96),rgba(8,11,20,0.98))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
                Last action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Latest created user
              </h3>

              {lastCreatedUser ? (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-50">
                  <p className="font-medium text-white">{lastCreatedUser.name}</p>
                  <p className="mt-1 text-emerald-100/80">{lastCreatedUser.email}</p>
                  <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                    {lastCreatedUser.role}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                  No users created from this session yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
