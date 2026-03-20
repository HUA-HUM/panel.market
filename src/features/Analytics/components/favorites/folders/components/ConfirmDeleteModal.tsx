type Props = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  disabled?: boolean;
};

export function ConfirmDeleteModal({
  open,
  onConfirm,
  onClose,
  disabled = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[420px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,39,0.98),rgba(10,12,19,0.98))] p-6 shadow-2xl">
        
        <h3 className="mb-2 text-lg font-semibold text-white">
          Delete folder?
        </h3>

        <p className="mb-6 text-sm text-zinc-400">
          This action cannot be undone.
        </p>

        {disabled && (
          <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
            Closed folders cannot be deleted.
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm transition hover:border-white/20"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              disabled
                ? 'cursor-not-allowed bg-red-900/40 text-red-400'
                : 'bg-red-600 text-white hover:bg-red-500'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
