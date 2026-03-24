'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useFolders } from '../hook/useFolders';
import {
  ExecutePublicationsResponse,
  useExecutePublications
} from '../hook/useExecutePublications';

const MARKETPLACES = [
  {
    id: 'megatone',
    label: 'Megatone',
    logo: '/marketplace/Megatone.svg'
  },
  {
    id: 'fravega',
    label: 'Frávega',
    logo: '/marketplace/fravega.png'
  }
];

type PublishPanelProps = {
  onRunCreated?: (runId: string) => void;
};

function SummaryRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}

export function PublishPanel({ onRunCreated }: PublishPanelProps) {
  const {
    folders,
    loading: loadingFolders,
    error: foldersError,
    refetch
  } = useFolders();
  const { execute, loading, error } = useExecutePublications();

  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ExecutePublicationsResponse | null>(null);
  const selectedFolderName =
    folders.find((folder) => folder.id === selectedFolder)?.name ?? null;
  const selectedMarketplaceLabels = MARKETPLACES
    .filter((marketplace) => selectedMarketplaces.includes(marketplace.id))
    .map((marketplace) => marketplace.label);
  const statusMessage = loading
    ? 'Launching run'
    : result
      ? 'Run created'
      : 'Waiting for configuration';

  const isSubmitDisabled =
    loading || loadingFolders || !selectedFolder || selectedMarketplaces.length === 0;

  const toggleMarketplace = (id: string) => {
    setValidationMessage(null);
    setResult(null);
    setSelectedMarketplaces(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const handleExecute = async () => {
    if (!selectedFolder) {
      const message = 'Select a source folder before launching the publication run.';
      setValidationMessage(message);
      toast.warning(message);
      return;
    }

    if (!selectedMarketplaces.length) {
      const message = 'Select at least one marketplace destination.';
      setValidationMessage(message);
      toast.warning(message);
      return;
    }

    try {
      setValidationMessage(null);
      const res = await execute({
        marketplaces: selectedMarketplaces,
        folderId: selectedFolder
      });
      setResult(res);
      toast.success('Publication run created', {
        description: `Run #${res.runId} is now available in the progress view.`,
      });
      onRunCreated?.(res.runId);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to launch the publication run.';
      toast.error('Launch failed', {
        description: message,
      });
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          relative overflow-hidden rounded-[28px] border border-white/10
          bg-[linear-gradient(145deg,rgba(8,12,26,0.98),rgba(7,11,18,0.98),rgba(4,7,16,1))]
          p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]
          md:p-8
        "
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_55%)]" />
          <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.024)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:84px_84px] opacity-[0.04]" />
        </div>

        <div className="relative space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Publication Run
              </div>

              <div className="max-w-3xl space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Create a publication run in two quick steps.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                  Choose a folder, pick the marketplaces, and launch the run. The progress view will handle the monitoring afterwards.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Current Summary
              </p>
              <div className="mt-4 space-y-4">
                <SummaryRow
                  label="Folder"
                  value={selectedFolderName ?? 'No folder selected'}
                />
                <SummaryRow
                  label="Marketplaces"
                  value={
                    selectedMarketplaceLabels.length
                      ? selectedMarketplaceLabels.join(', ')
                      : 'No marketplaces selected'
                  }
                />
                <SummaryRow label="Status" value={statusMessage} />
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                1. Source Folder
              </label>
              <p className="mt-2 text-sm text-zinc-400">
                Select the product collection you want to publish.
              </p>

              <div className="mt-5">
                {loadingFolders ? (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-8 text-sm text-zinc-500 animate-pulse">
                    Loading available folders...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      className="
                        w-full appearance-none rounded-2xl border border-white/10
                        bg-white/[0.04] px-4 py-4 text-sm text-white
                        outline-none transition
                        focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20
                      "
                      value={selectedFolder ?? ''}
                      onChange={(e) => {
                        const nextValue = e.target.value ? Number(e.target.value) : null;
                        setValidationMessage(null);
                        setResult(null);
                        setSelectedFolder(nextValue);
                      }}
                    >
                      <option value="">Select a folder</option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      ▼
                    </div>
                  </div>
                )}
              </div>

              {foldersError && (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  <span>Unable to load folders.</span>
                  <button
                    type="button"
                    onClick={refetch}
                    className="font-medium text-red-50 underline underline-offset-4"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                2. Destination Marketplaces
              </label>
              <p className="mt-2 text-sm text-zinc-400">
                Pick one or more marketplaces for this run.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {MARKETPLACES.map((marketplace) => {
                  const selected = selectedMarketplaces.includes(marketplace.id);

                  return (
                    <button
                      key={marketplace.id}
                      type="button"
                      onClick={() => toggleMarketplace(marketplace.id)}
                      className={`
                        group rounded-[22px] border p-4 text-left transition-all duration-200
                        ${
                          selected
                            ? 'border-cyan-400/35 bg-cyan-400/10 shadow-[0_14px_36px_rgba(34,211,238,0.12)]'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-3">
                          <Image
                            src={marketplace.logo}
                            alt={marketplace.label}
                            width={34}
                            height={34}
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-white">
                            {marketplace.label}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {selected ? 'Selected for this run' : 'Click to include'}
                          </p>
                        </div>

                        <div
                          className={`
                            flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold
                            ${
                              selected
                                ? 'border-cyan-300/40 bg-cyan-300/20 text-cyan-100'
                                : 'border-white/10 bg-white/5 text-zinc-500'
                            }
                          `}
                        >
                          {selected ? 'OK' : '+'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {(validationMessage || error || result) && (
            <section
              className={`rounded-[24px] border px-5 py-4 text-sm ${
                result
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-50'
                  : 'border-red-400/20 bg-red-500/10 text-red-50'
              }`}
            >
              {result ? (
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="text-base font-semibold">
                      {result.message || 'Publication run created successfully.'}
                    </p>
                    <p className="mt-1 text-sm text-emerald-100/80">
                      The run is now available and ready to be tracked from the progress view.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/70">Run</p>
                      <p className="mt-2 font-semibold">{result.runId}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/70">SKUs</p>
                      <p className="mt-2 font-semibold">{result.totalSkus}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/70">Jobs</p>
                      <p className="mt-2 font-semibold">{result.totalJobs}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>{validationMessage || error}</p>
              )}
            </section>
          )}

          <section className="flex flex-col gap-4 rounded-[24px] border border-white/8 bg-black/20 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Ready to create the run
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {selectedFolderName && selectedMarketplaceLabels.length
                  ? `${selectedFolderName} will be sent to ${selectedMarketplaceLabels.join(', ')}.`
                  : 'Complete both steps to enable execution.'}
              </p>
            </div>

            <button
              onClick={handleExecute}
              disabled={isSubmitDisabled}
              className="
                inline-flex min-w-[260px] items-center justify-center rounded-2xl
                border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-6 py-4
                text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)]
                transition duration-200 hover:scale-[1.01] hover:shadow-[0_22px_50px_rgba(37,99,235,0.4)]
                disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
              "
            >
              {loading ? 'Launching run...' : 'Launch Publication Run'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
