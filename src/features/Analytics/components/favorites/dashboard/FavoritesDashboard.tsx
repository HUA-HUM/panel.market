'use client';

import { useState } from 'react';

import { useMarketplaces } from '../folders/hooks/useMarketplaces';
import { useCreateMarketplace } from '../folders/hooks/useCreateMarketplace';
import { useDeleteMarketplace } from '../folders/hooks/useDeleteMarketplace';
import { useUpdateMarketplaceStatus } from '../folders/hooks/useUpdateMarketplaceStatus';

import { useMarketplaceOverview } from '../overview/hooks/useMarketplaceOverview';

import { MarketplaceOverviewCards } from '../overview/components/MarketplaceOverviewCards';
import { MarketplaceStatusBadge } from '../folders/components/MarketplaceStatusBadge';
import { CreateMarketplaceModal } from '../folders/components/CreateMarketplaceModal';
import { ConfirmDeleteModal } from '../folders/components/ConfirmDeleteModal';
import { MarketplaceTabs } from './MarketplaceTabs';

export default function FavoritesDashboard() {
  const { marketplaces, loading, reload } = useMarketplaces();
  const { createMarketplace } = useCreateMarketplace();
  const { deleteMarketplace } = useDeleteMarketplace();
  const { updateStatus } = useUpdateMarketplaceStatus();

  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const selected = marketplaces.find(m => m.id === selectedId);

  const { data: overview, loading: loadingOverview } =
    useMarketplaceOverview(selectedId);

  const handleCreate = async (name: string) => {
    await createMarketplace(name);
    await reload();
    setShowCreate(false);
  };

  const handleDelete = async () => {
    if (!selected) return;

    if (selected.status === 'closed') {
      alert('No se puede eliminar una carpeta cerrada.');
      return;
    }

    await deleteMarketplace(selected.id);
    setSelectedId(undefined);
    setShowDelete(false);
    await reload();
  };

  const handleStatusToggle = async () => {
    if (!selected) return;

    const newStatus =
      selected.status === 'active' ? 'closed' : 'active';

    await updateStatus(selected.id, newStatus);
    await reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MarketplaceTabs
        marketplaces={marketplaces}
        selected={selectedId}
        onSelect={setSelectedId}
        onCreate={() => setShowCreate(true)}
      />

      <CreateMarketplaceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />

      {!selectedId && (
        <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] py-20 text-center text-zinc-500">
          Select a folder or create a new one.
        </div>
      )}

      {selected && (
        <div
          className={`space-y-10 transition ${
            selected.status === 'closed'
              ? 'opacity-60'
              : ''
          }`}
        >

          {/* ================= HEADER ================= */}

          <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-semibold text-white">
                    {selected.name}
                  </h2>
                  <MarketplaceStatusBadge status={selected.status} />
                </div>

                <p className="text-sm text-zinc-400">
                  Manage products and overview metrics for this folder.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    window.open(
                      `/admin/commerce/favorites/${selectedId}/products`,
                      '_blank'
                    )
                  }
                  className="rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.01]"
                >
                  View products
                </button>

                <button
                  onClick={handleStatusToggle}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:border-white/20"
                >
                  {selected.status === 'active'
                    ? 'Close folder'
                    : 'Reactivate'}
                </button>

                <button
                  onClick={() => setShowDelete(true)}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-100 transition hover:bg-red-500/15"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* ================= OVERVIEW ================= */}

          <div className="transition-all duration-300 min-h-[200px] flex items-center justify-center">

            {loadingOverview ? (
              <Spinner />
            ) : overview ? (
              <MarketplaceOverviewCards
                overview={overview}
                marketplaceId={selected.id}
              />
            ) : null}

          </div>

        </div>
      )}

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

    </div>
  );
}


/* ================= SPINNER ================= */

function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
    </div>
  );
}
