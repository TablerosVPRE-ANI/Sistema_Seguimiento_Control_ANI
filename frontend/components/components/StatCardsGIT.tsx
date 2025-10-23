// components/components/StatCardsGIT.tsx

'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { TipoGIT, Criticidad } from '@/types';
import { Users, Scale, Home, Leaf, ShieldAlert, TrendingUp } from 'lucide-react';
import DetalleGIT from './DetalleGIT';

export default function StatCardsGIT() {
  const { statsGIT, setSelectedProyecto } = useStore();
  const [gitSeleccionado, setGitSeleccionado] = useState<TipoGIT | null>(null);
  const [criticidadSeleccionada, setCriticidadSeleccionada] = useState<Criticidad | null>(null);

  const getGITIcon = (git: TipoGIT) => {
    const icons = {
      'Social': Users,
      'JPredial': Scale,
      'Predial': Home,
      'Ambiental': Leaf,
      'Riesgos': ShieldAlert,
      'Valorizacion': TrendingUp,
    };
    return icons[git];
  };

  const getGITColor = (git: TipoGIT) => {
    const colores = {
      'Social': { 
        bg: 'bg-purple-500/20', 
        border: 'border-purple-500/30', 
        text: 'text-purple-300', 
        icon: 'text-purple-400',
        hover: 'hover:bg-purple-500/30 hover:border-purple-500/50'
      },
      'JPredial': { 
        bg: 'bg-blue-500/20', 
        border: 'border-blue-500/30', 
        text: 'text-blue-300', 
        icon: 'text-blue-400',
        hover: 'hover:bg-blue-500/30 hover:border-blue-500/50'
      },
      'Predial': { 
        bg: 'bg-cyan-500/20', 
        border: 'border-cyan-500/30', 
        text: 'text-cyan-300', 
        icon: 'text-cyan-400',
        hover: 'hover:bg-cyan-500/30 hover:border-cyan-500/50'
      },
      'Ambiental': { 
        bg: 'bg-green-500/20', 
        border: 'border-green-500/30', 
        text: 'text-green-300', 
        icon: 'text-green-400',
        hover: 'hover:bg-green-500/30 hover:border-green-500/50'
      },
      'Riesgos': { 
        bg: 'bg-red-500/20', 
        border: 'border-red-500/30', 
        text: 'text-red-300', 
        icon: 'text-red-400',
        hover: 'hover:bg-red-500/30 hover:border-red-500/50'
      },
      'Valorizacion': { 
        bg: 'bg-yellow-500/20', 
        border: 'border-yellow-500/30', 
        text: 'text-yellow-300', 
        icon: 'text-yellow-400',
        hover: 'hover:bg-yellow-500/30 hover:border-yellow-500/50'
      },
    };
    return colores[git];
  };

  const handleCriticidadClick = (git: TipoGIT, criticidad: Criticidad) => {
    setGitSeleccionado(git);
    setCriticidadSeleccionada(criticidad);
  };

  const handleClose = () => {
    setGitSeleccionado(null);
    setCriticidadSeleccionada(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsGIT.map((stat) => {
          const Icon = getGITIcon(stat.git);
          const color = getGITColor(stat.git);

          return (
            <div
              key={stat.git}
              className={`
                ${color.bg} backdrop-blur-lg rounded-2xl border ${color.border} p-6
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-white/10 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${color.icon}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${color.text}`}>
                      {stat.git}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {stat.totalEvaluaciones} evaluaciones
                    </p>
                  </div>
                </div>
                {/* Indicador de interactividad */}
                <div className="text-gray-500 text-xs">
                  👁️ Click en estado
                </div>
              </div>

              {/* Distribución de criticidad - CADA LÍNEA ES CLICKEABLE */}
              <div className="space-y-2 mb-4">
                {stat.criticos > 0 && (
                  <button
                    onClick={() => handleCriticidadClick(stat.git, 'CRÍTICO')}
                    className="w-full flex items-center justify-between text-sm p-2 rounded-lg hover:bg-red-500/20 transition-colors group"
                  >
                    <span className="text-red-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></span>
                      Crítico
                    </span>
                    <span className="font-bold text-red-400 group-hover:scale-110 transition-transform">
                      {stat.criticos}
                    </span>
                  </button>
                )}
                {stat.enRiesgo > 0 && (
                  <button
                    onClick={() => handleCriticidadClick(stat.git, 'EN RIESGO')}
                    className="w-full flex items-center justify-between text-sm p-2 rounded-lg hover:bg-orange-500/20 transition-colors group"
                  >
                    <span className="text-orange-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-125 transition-transform"></span>
                      En Riesgo
                    </span>
                    <span className="font-bold text-orange-400 group-hover:scale-110 transition-transform">
                      {stat.enRiesgo}
                    </span>
                  </button>
                )}
                {stat.enObservacion > 0 && (
                  <button
                    onClick={() => handleCriticidadClick(stat.git, 'EN OBSERVACIÓN')}
                    className="w-full flex items-center justify-between text-sm p-2 rounded-lg hover:bg-yellow-500/20 transition-colors group"
                  >
                    <span className="text-yellow-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full group-hover:scale-125 transition-transform"></span>
                      En Observación
                    </span>
                    <span className="font-bold text-yellow-400 group-hover:scale-110 transition-transform">
                      {stat.enObservacion}
                    </span>
                  </button>
                )}
                {stat.normales > 0 && (
                  <button
                    onClick={() => handleCriticidadClick(stat.git, 'NORMAL')}
                    className="w-full flex items-center justify-between text-sm p-2 rounded-lg hover:bg-green-500/20 transition-colors group"
                  >
                    <span className="text-green-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></span>
                      Normal
                    </span>
                    <span className="font-bold text-green-400 group-hover:scale-110 transition-transform">
                      {stat.normales}
                    </span>
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Proyectos afectados</span>
                  <span className={`font-bold ${color.text}`}>
                    {stat.proyectosAfectados}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalle */}
      <DetalleGIT
        git={gitSeleccionado}
        criticidadFiltro={criticidadSeleccionada}
        onClose={handleClose}
        onSelectProyecto={setSelectedProyecto}
      />
    </>
  );
}