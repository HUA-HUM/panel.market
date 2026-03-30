'use client';

import { FormEvent, useState } from 'react';

type UserRole = 'admin' | 'operator' | 'viewer';

type CreateUserModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive: boolean;
  }) => Promise<void>;
};

const DEFAULT_FORM = {
  email: '',
  name: '',
  password: '',
  role: 'operator' as UserRole,
  isActive: true,
};

export function CreateUserModal({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreateUserModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setForm(DEFAULT_FORM);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(DEFAULT_FORM);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,19,34,0.98),rgba(8,12,22,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
              Access Control
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Create user
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              A bcrypt hash will be generated server-side before sending the user to madre-api.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
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

          <div className="md:col-span-2 mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating user...' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
