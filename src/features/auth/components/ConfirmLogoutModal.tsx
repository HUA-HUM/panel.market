'use client';

type ConfirmLogoutModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmLogoutModal({
  open,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmLogoutModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,34,0.98),rgba(8,11,20,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-200">
          <LogoutIcon />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-white">
          Close current session?
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          We will end the current session, clear local credentials, and return you to the login screen.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-red-400/20 bg-[linear-gradient(135deg,rgba(248,113,113,0.95),rgba(153,27,27,0.95))] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Closing session...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
