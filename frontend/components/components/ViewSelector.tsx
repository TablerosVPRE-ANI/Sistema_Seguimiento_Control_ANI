// components/components/ViewSelector.tsx

'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { LayoutGrid, List, Star } from 'lucide-react';

export default function ViewSelector() {
  const { vistaActual, setVistaActual } = useStore();

  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-1">
      {/* Vista General */}
      <button
        onClick={() => setVistaActual('general')}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
          ${vistaActual === 'general' 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <LayoutGrid className="w-5 h-5" />
        <span>Vista General VPRE</span>
      </button>

      {/* Vista por GIT */}
      <button
        onClick={() => setVistaActual('git')}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
          ${vistaActual === 'git' 
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <List className="w-5 h-5" />
        <span>Vista por GIT</span>
      </button>

      {/* ✅ NUEVO: Vista de Seguimiento */}
      <button
        onClick={() => setVistaActual('seguimiento')}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
          ${vistaActual === 'seguimiento' 
            ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <Star className={`w-5 h-5 ${vistaActual === 'seguimiento' ? 'fill-white' : ''}`} />
        <span>Seguimiento</span>
      </button>
    </div>
  );
}