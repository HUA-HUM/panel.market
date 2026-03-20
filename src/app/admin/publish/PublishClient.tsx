'use client';

import { useState } from 'react';
import { PublishPanel } from "@/src/features/publisher/components/PublishModal";

export default function PublishClient() {
  const [tab, setTab] = useState<'publish' | 'progress'>('publish');

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Publicador
        </h1>

        <p className="text-sm text-zinc-400">
          Ejecutá publicaciones y monitoreá su progreso
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl w-fit border border-zinc-800">
        <button
          onClick={() => setTab('publish')}
          className={`
            px-4 py-2 text-sm rounded-lg transition
            ${
              tab === 'publish'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }
          `}
        >
          Publicar
        </button>

        <button
          onClick={() => setTab('progress')}
          className={`
            px-4 py-2 text-sm rounded-lg transition
            ${
              tab === 'progress'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }
          `}
        >
          Progreso
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-6">

        {tab === 'publish' && (
          <div className="animate-fadeIn">
            <PublishPanel />
          </div>
        )}

        {tab === 'progress' && (
          <div
            className="
              bg-zinc-900 border border-zinc-800
              rounded-2xl p-8
              space-y-6
            "
          >
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white">
                Progreso de ejecuciones
              </h2>

              <p className="text-xs text-zinc-400">
                Estado actual de tus publicaciones
              </p>
            </div>

            <div
              className="
                border border-dashed border-zinc-700
                rounded-xl p-10
                flex flex-col items-center justify-center gap-3
                text-center
              "
            >
              <div className="text-3xl">📭</div>

              <p className="text-sm text-zinc-300">
                No hay ejecuciones todavía
              </p>

              <p className="text-xs text-zinc-500">
                Ejecutá una publicación para ver resultados acá
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}