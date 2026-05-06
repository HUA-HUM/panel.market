'use client';

import { useState } from 'react';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';
import { Marketplace } from '@/src/core/entitis/madre/analitics/favorites/folder/status/marketplace.types';
import { toast } from "sonner";


type Props = {
  folders: Marketplace[];
  filters: ProductsFilters;

  onSaveFlow: (
    marketplaceId: number,
    filters: ProductsFilters
  ) => Promise<any>;

  onCreateFolder: (name: string) => Promise<any>;

  loading: boolean;
};

export function SaveToFolderBar({
  folders,
  filters,
  onSaveFlow,
  onCreateFolder,
}: Props) {

  const [selectedFolderId, setSelectedFolderId] = useState<number>();
  const [newFolderName, setNewFolderName] = useState('');

  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateFolder = async () => {
    if (!newFolderName) return;

    try {
      setCreating(true);

      await onCreateFolder(newFolderName);
      setNewFolderName('');
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFolderId) {
     toast.warning("Seleccioná una carpeta")
      return;
    }

    try {
      setSaving(true);

      const requestPayload = {
        marketplaceId: selectedFolderId,
        filters,
      };

      console.log('[SaveToFolderBar] Saving product selection to folder', requestPayload);

      const result = await onSaveFlow(selectedFolderId, filters);

      console.log('[SaveToFolderBar] Save product selection response', result);

      toast.success("Productos guardados en la carpeta")
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 shadow-md">

      {/* GUARDAR EN CARPETA */}

      <div className="flex gap-4 items-center">

        <select
          value={selectedFolderId ?? ''}
          onChange={(e) =>
            setSelectedFolderId(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="flex-1 h-11 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-green-600"
        >
          <option value="">Seleccionar carpeta</option>

          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={saving}
          className="
            px-6 py-2.5
            bg-green-600 hover:bg-green-500
            rounded-lg text-white
            flex items-center gap-2
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition
          "
        >
          {saving && (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}

          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* CREAR CARPETA */}

      <div className="flex gap-4 items-center">

        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Nueva carpeta..."
          className="flex-1 h-11 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleCreateFolder}
          disabled={creating}
          className="
            px-6 py-2.5
            bg-blue-600 hover:bg-blue-500
            rounded-lg text-white
            flex items-center gap-2
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition
          "
        >
          {creating && (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}

          {creating ? 'Creando...' : 'Crear'}
        </button>
      </div>
    </div>
  );
}
