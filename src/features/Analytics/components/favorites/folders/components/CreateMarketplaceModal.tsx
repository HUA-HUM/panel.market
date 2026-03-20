'use client';

import { useState } from 'react';

type Props = {
  open: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
};

export function CreateMarketplaceModal({
  open,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState('');

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;

    await onSubmit(name.trim());
    setName('');
    onClose(); // 👈 esto es importante
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[420px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,39,0.98),rgba(10,12,19,0.98))] p-6 shadow-2xl">

        <h3 className="mb-4 text-lg font-semibold text-white">
          Create new folder
        </h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Folder name"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-white transition hover:border-white/20"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-4 py-2 text-white transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
