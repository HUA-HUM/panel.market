'use client';

import Image from 'next/image';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useFolders } from '../hook/useFolders';
import { MARKETPLACES as AVAILABLE_MARKETPLACES } from '@/src/features/marketplace/config/marketplaces';
import {
  ExecutePublicationsResponse,
  useExecutePublications
} from '../hook/useExecutePublications';

const MARKETPLACES = AVAILABLE_MARKETPLACES.map((marketplace) => ({
  id: marketplace.id,
  label: marketplace.name,
  logo: marketplace.logo,
  logoWidth: marketplace.id === 'oncity' ? 72 : marketplace.id === 'megatone' ? 76 : 68,
}));

type PublishPanelProps = {
  onRunCreated?: (runId: string) => void;
  onLaunchStarted?: () => void;
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

function InfoTile({
  eyebrow,
  value,
  helper
}: {
  eyebrow: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{eyebrow}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{helper}</p>
    </div>
  );
}

function SelectionChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-200">
      {children}
    </span>
  );
}

function StepHeader({
  step,
  title,
  description
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-semibold text-cyan-100">
        {step}
      </div>
      <div>
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

export function PublishPanel({ onRunCreated, onLaunchStarted }: PublishPanelProps) {
  const {
    folders,
    loading: loadingFolders,
    error: foldersError,
    refetch
  } = useFolders();
  const { execute, loading, error } = useExecutePublications();
  const isMountedRef = useRef(true);

  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ExecutePublicationsResponse | null>(null);
  const [launchInBackground, setLaunchInBackground] = useState(false);
  const [uiSubmitting, setUiSubmitting] = useState(false);
  const [folderQuery, setFolderQuery] = useState('');
  const deferredFolderQuery = useDeferredValue(folderQuery);
  const selectedFolderName =
    folders.find((folder) => folder.id === selectedFolder)?.name ?? null;
  const selectedMarketplaceLabels = MARKETPLACES
    .filter((marketplace) => selectedMarketplaces.includes(marketplace.id))
    .map((marketplace) => marketplace.label);
  const statusMessage = uiSubmitting
    ? 'Sending launch request'
    : launchInBackground
      ? 'Initializing in background'
    : loading
      ? 'Launching run'
    : result
      ? 'Run created'
      : 'Waiting for configuration';

  const isSubmitDisabled =
    uiSubmitting || loadingFolders || !selectedFolder || selectedMarketplaces.length === 0;
  const selectedCount = selectedMarketplaces.length;
  const normalizedFolderQuery = deferredFolderQuery.trim().toLowerCase();
  const visibleFolders = normalizedFolderQuery
    ? folders.filter((folder) =>
        folder.name.toLowerCase().includes(normalizedFolderQuery),
      )
    : folders;
  const launchButtonLabel = uiSubmitting || loading
    ? 'Launching run...'
    : launchInBackground
      ? 'Run started in background'
      : 'Launch Publication Run';

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const toggleMarketplace = (id: string) => {
    setValidationMessage(null);
    setResult(null);
    setLaunchInBackground(false);
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
      setLaunchInBackground(false);
      setUiSubmitting(true);

      let resolved = false;
      let movedToBackground = false;

      const requestPromise = execute({
        marketplaces: selectedMarketplaces,
        folderId: selectedFolder
      });

      const backgroundTimer = window.setTimeout(() => {
        if (resolved || movedToBackground) {
          return;
        }

        movedToBackground = true;

        if (isMountedRef.current) {
          setUiSubmitting(false);
          setLaunchInBackground(true);
        }

        toast.info('Run initialization started', {
          description: 'The backend is processing the SKU batches. Follow the run from the Runs tab while it continues in background.',
        });
        onLaunchStarted?.();
      }, 1800);

      const res = await requestPromise;
      resolved = true;
      window.clearTimeout(backgroundTimer);

      if (isMountedRef.current) {
        setUiSubmitting(false);
        setLaunchInBackground(false);
        setResult(res);
      }

      toast.success('Publication run created', {
        description: `Run #${res.runId} is now available in the progress view.`,
      });
      onRunCreated?.(res.runId);
    } catch (err: unknown) {
      if (isMountedRef.current) {
        setUiSubmitting(false);
        setLaunchInBackground(false);
      }

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
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                Publication Run
              </div>

              <div className="max-w-3xl space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Build the run in a simple 2-step flow.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
                  Choose one saved folder, select the marketplaces, and launch. Once the run starts, the Runs and Jobs tabs take over the tracking.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <SelectionChip>
                  {selectedFolderName ? `Folder: ${selectedFolderName}` : 'No folder selected'}
                </SelectionChip>
                <SelectionChip>
                  {selectedCount > 0 ? `${selectedCount} marketplace${selectedCount > 1 ? 's' : ''} selected` : 'No marketplaces selected'}
                </SelectionChip>
                <SelectionChip>{statusMessage}</SelectionChip>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Current Summary
                </p>
                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-300">
                  {selectedCount > 0 && selectedFolderName ? 'Ready' : 'Pending'}
                </span>
              </div>
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
              <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-zinc-400">
                {selectedFolderName && selectedMarketplaceLabels.length
                  ? `This run will publish ${selectedFolderName} to ${selectedMarketplaceLabels.join(', ')}.`
                  : 'Complete the two steps below and the launch button will be ready.'}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <InfoTile
              eyebrow="Step 1"
              value={selectedFolderName ?? 'Pick a folder'}
              helper="The source collection used for this publication run."
            />
            <InfoTile
              eyebrow="Step 2"
              value={selectedMarketplaceLabels.length ? selectedMarketplaceLabels.join(', ') : 'Choose marketplaces'}
              helper="One or more destinations can be selected at the same time."
            />
            <InfoTile
              eyebrow="Launch status"
              value={statusMessage}
              helper="Long launches can continue in background while the backend prepares jobs."
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 md:p-6">
              <StepHeader
                step="1"
                title="Source folder"
                description="Pick the saved collection you want to publish in this run. This selector is custom so it looks the same on Mac and Windows."
              />

              <div className="mt-5">
                {loadingFolders ? (
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-8 text-sm text-zinc-500 animate-pulse">
                    Loading available folders...
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        Search folder
                      </label>
                      <input
                        type="text"
                        value={folderQuery}
                        onChange={(event) => setFolderQuery(event.target.value)}
                        placeholder="Type a folder name..."
                        className="mt-2 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                      />
                      <p className="mt-2 text-xs text-zinc-500">
                        {visibleFolders.length} folder{visibleFolders.length === 1 ? '' : 's'} available
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0a0f1c] p-2">
                      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                        {visibleFolders.map((folder) => {
                          const selected = selectedFolder === folder.id;

                          return (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() => {
                                setValidationMessage(null);
                                setResult(null);
                                setSelectedFolder(folder.id);
                              }}
                              className={`
                                flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition
                                ${
                                  selected
                                    ? 'border-cyan-400/35 bg-cyan-400/10 text-white shadow-[0_12px_30px_rgba(34,211,238,0.10)]'
                                    : 'border-white/8 bg-white/[0.03] text-zinc-300 hover:border-white/16 hover:bg-white/[0.05]'
                                }
                              `}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {folder.name}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  Source folder #{folder.id}
                                </p>
                              </div>
                              <div
                                className={`
                                  flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold
                                  ${
                                    selected
                                      ? 'border-cyan-300/40 bg-cyan-300/20 text-cyan-100'
                                      : 'border-white/10 bg-white/5 text-zinc-500'
                                  }
                                `}
                              >
                                {selected ? 'OK' : '+'}
                              </div>
                            </button>
                          );
                        })}

                        {visibleFolders.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-zinc-500">
                            No folders match your search.
                          </div>
                        )}
                      </div>
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

              {selectedFolderName && (
                <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
                  Selected folder: <span className="font-semibold text-white">{selectedFolderName}</span>
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 md:p-6">
              <StepHeader
                step="2"
                title="Destination marketplaces"
                description="Choose where the folder should be published. These cards behave the same way across Mac and Windows."
              />

              {selectedMarketplaceLabels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedMarketplaceLabels.map((label) => (
                    <SelectionChip key={label}>{label}</SelectionChip>
                  ))}
                </div>
              )}

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
                          <div
                            className="relative h-7"
                            style={{ width: `${marketplace.logoWidth}px` }}
                          >
                            <Image
                              src={marketplace.logo}
                              alt={marketplace.label}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-white">
                            {marketplace.label}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {selected ? 'Included in this run' : 'Click to include in the run'}
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

          <section className="rounded-[24px] border border-white/8 bg-black/20 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">
                  Review and launch
                </p>
                <p className="text-sm text-zinc-400">
                  {selectedFolderName && selectedMarketplaceLabels.length
                    ? `${selectedFolderName} will be sent to ${selectedMarketplaceLabels.join(', ')}.`
                    : 'Complete both steps to enable execution.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <SelectionChip>{selectedFolderName ?? 'Missing folder'}</SelectionChip>
                  <SelectionChip>
                    {selectedMarketplaceLabels.length
                      ? selectedMarketplaceLabels.join(', ')
                      : 'Missing marketplace'}
                  </SelectionChip>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleExecute}
                  disabled={isSubmitDisabled}
                  className="
                    inline-flex min-w-[280px] items-center justify-center rounded-2xl
                    border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-6 py-4
                    text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)]
                    transition duration-200 hover:scale-[1.01] hover:shadow-[0_22px_50px_rgba(37,99,235,0.4)]
                    disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
                  "
                >
                  {launchButtonLabel}
                </button>
                <p className="text-xs text-zinc-500">
                  After launch, follow the detailed progress from the Runs and Jobs tabs.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
