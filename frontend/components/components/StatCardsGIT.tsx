// components/StatCardsGIT.tsx

'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { AlertTriangle, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import { TipoGIT } from '@/types';

export default function StatCardsGIT() {
  const { statsGIT } = useStore();

  // Mapeo de iconos y colores por GIT
  const gitConfig: Record<TipoGIT, { icon: any; color: string; bgColor: string }> = {
    'Social': { 
      icon: AlertTriangle, 
      color: 'text-purple-400', 
      bgColor: 'bg-purple-500/20 border-purple-500/30' 
    },
    'JPredial': { 
      icon: TrendingUp, 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/20 border-blue-500/30' 
    },
    'Predial': { 
      icon: CheckCircle, 
      color: 'text-cyan-400', 
      bgColor: 'bg-cyan-500/20 border-cyan-500/30' 
    },
    'Ambiental': { 
      icon: Eye, 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20 border-green-500/30' 
    },
    'Riesgos': { 
      icon: AlertTriangle, 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20 border-red-500/30' 
    },
    'Valorizacion': { 
      icon: TrendingUp, 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20 border-yellow-500/30' 
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statsGIT.map((stat) => {
        const config = gitConfig[stat.git];
        const Icon = config.icon;

        return (
          <div
            key={stat.git}
            className={`${config.bgColor} backdrop-blur-lg rounded-2xl border p-6 transition-all duration-300 hover:scale-105`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${config.bgColor} rounded-xl`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{stat.git}</h3>
                  <p className="text-xs text-gray-400">
                    {stat.totalEvaluaciones} evaluaciones
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas por criticidad */}
            <div className="space-y-3">
              {/* Críticos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-300">Crítico</span>
                </div>
                <span className="text-lg font-bold text-red-400">{stat.criticos}</span>
              </div>

              {/* En Riesgo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-300">En Riesgo</span>
                </div>
                <span className="text-lg font-bold text-orange-400">{stat.enRiesgo}</span>
              </div>

              {/* En Observación */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-300">En Observación</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">{stat.enObservacion}</span>
              </div>

              {/* Normal */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-300">Normal</span>
                </div>
                <span className="text-lg font-bold text-green-400">{stat.normales}</span>
              </div>
            </div>

            {/* Footer - Proyectos afectados */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Proyectos con alertas</span>
                <span className="text-sm font-semibold text-white">{stat.proyectosAfectados}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}