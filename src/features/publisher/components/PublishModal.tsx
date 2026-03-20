'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useFolders } from '../hook/useFolders';
import { useExecutePublications } from '../hook/useExecutePublications';

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

export function PublishPanel() {
  const { folders, loading: loadingFolders } = useFolders();
  const { execute, loading } = useExecutePublications();

  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);

  const toggleMarketplace = (id: string) => {
    setSelectedMarketplaces(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const handleExecute = async () => {
    if (!selectedFolder) return alert('Seleccioná una carpeta');
    if (!selectedMarketplaces.length) return alert('Seleccioná marketplaces');

    try {
      const res = await execute({
        marketplaces: selectedMarketplaces,
        folderId: selectedFolder
      });

      alert(`Run creado 🚀 ID: ${res.runId}`);
    } catch {
      alert('Error ejecutando');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="
          relative overflow-hidden
          bg-zinc-900/70 backdrop-blur-xl
          border border-zinc-800
          rounded-2xl p-8 space-y-8
          shadow-[0_0_40px_rgba(59,130,246,0.08)]
        "
      >
        {/* glow decorativo */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Nueva publicación
          </h2>
          <p className="text-sm text-zinc-400">
            Elegí una carpeta y los marketplaces donde querés publicar
          </p>
        </div>

        {/* FOLDER */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Carpeta
          </label>

          {loadingFolders ? (
            <div className="text-sm text-zinc-500 animate-pulse">
              Cargando carpetas...
            </div>
          ) : (
            <div className="relative">
              <select
                className="
                  w-full bg-zinc-800/80
                  border border-zinc-700
                  rounded-xl px-4 py-3
                  text-sm text-white
                  appearance-none
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-500/50
                  transition
                "
                value={selectedFolder ?? ''}
                onChange={(e) => setSelectedFolder(Number(e.target.value))}
              >
                <option value="">Seleccionar carpeta</option>

                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>

              {/* icono */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                ▼
              </div>
            </div>
          )}
        </div>

        {/* MARKETPLACES */}
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Marketplaces
          </label>

          <div className="grid grid-cols-2 gap-4">
            {MARKETPLACES.map(m => {
              const selected = selectedMarketplaces.includes(m.id);

              return (
                <button
                  key={m.id}
                  onClick={() => toggleMarketplace(m.id)}
                  className={`
                    group relative
                    flex items-center gap-4
                    px-4 py-3 rounded-xl
                    border transition-all duration-200
                    ${
                      selected
                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/60'
                    }
                  `}
                >
                  {/* indicador activo */}
                  {selected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  )}

                  {/* LOGO */}
                  <div className="bg-white rounded-md p-2 flex items-center justify-center">
                    <Image
                      src={m.logo}
                      alt={m.label}
                      width={26}
                      height={26}
                      className="object-contain"
                    />
                  </div>

                  <span className="text-sm text-white font-medium">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTION */}
        <div className="pt-2">
          <button
            onClick={handleExecute}
            disabled={loading}
            className="
              w-full py-3 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-blue-600 to-blue-500
              hover:from-blue-500 hover:to-blue-400
              disabled:opacity-50
              shadow-[0_10px_25px_rgba(59,130,246,0.3)]
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            {loading ? 'Ejecutando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
}