'use client';

import { useState } from 'react';
import { PublishPanel } from '@/src/features/publisher/components/PublishModal';
import { PublicationJobsPanel } from '@/src/features/publisher/components/PublicationJobsPanel';
import { PublicationRunsPanel } from '@/src/features/publisher/components/PublicationRunsPanel';

type PublishTab = 'publish' | 'runs' | 'jobs';

const TABS: Array<{
  id: PublishTab;
  label: string;
  description: string;
}> = [
  {
    id: 'publish',
    label: 'Launch',
    description: 'Create a new publication run.'
  },
  {
    id: 'runs',
    label: 'Runs',
    description: 'Review all publication runs.'
  },
  {
    id: 'jobs',
    label: 'Jobs',
    description: 'Inspect SKU jobs grouped by run.'
  }
];

export default function PublishClient() {
  const [tab, setTab] = useState<PublishTab>('publish');
  const [activeRunId, setActiveRunId] = useState<string | null>(null);

  return (
    <div className="w-full px-6 py-10">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
              Publishing
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Publication Runs
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
              Launch new runs, review their history, and inspect SKU jobs from one place. The flow below is optimized for quick operation on both desktop and laptop screens.
            </p>
          </div>

          {activeRunId && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
              Recent run: <span className="font-semibold text-white">#{activeRunId}</span>
            </div>
          )}
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="grid gap-2 md:grid-cols-3">
            {TABS.map((item) => {
              const active = item.id === tab;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`
                    rounded-[18px] border px-4 py-4 text-left transition-all duration-200
                    ${
                      active
                        ? 'border-cyan-300/20 bg-[linear-gradient(135deg,rgba(103,232,249,0.16),rgba(37,99,235,0.18))] shadow-[0_18px_45px_rgba(37,99,235,0.18)]'
                        : 'border-white/8 bg-black/10 hover:border-white/14 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className={`text-base font-semibold ${active ? 'text-white' : 'text-zinc-200'}`}>
                        {item.label}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {item.description}
                      </p>
                    </div>

                    <div
                      className={`
                        flex min-w-[62px] shrink-0 items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]
                        ${
                          active
                            ? 'border-cyan-300/30 bg-cyan-300/15 text-cyan-100'
                            : 'border-white/10 bg-white/[0.04] text-zinc-500'
                        }
                      `}
                    >
                      {active ? 'Active' : 'Open'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          {tab === 'publish' && (
            <PublishPanel
              onLaunchStarted={() => {
                setTab('runs');
              }}
              onRunCreated={(runId) => {
                setActiveRunId(String(runId));
                setTab('runs');
              }}
            />
          )}

          {tab === 'runs' && (
            <PublicationRunsPanel
              activeRunId={activeRunId}
              onSelectRun={(runId) => {
                setActiveRunId(runId);
              }}
            />
          )}

          {tab === 'jobs' && (
            <PublicationJobsPanel
              activeRunId={activeRunId}
              onSelectRun={(runId) => {
                setActiveRunId(runId);
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}
