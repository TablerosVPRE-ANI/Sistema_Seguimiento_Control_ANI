// components/components/FiltroRapido.tsx

'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { FiltroRapido as FiltroRapidoType } from '@/types';
import { Filter, AlertTriangle, TrendingUp, Eye, CheckCircle } from 'lucide-react';

export default function FiltroRapido() {
  const { filtroRapido, setFiltroRapido, stats } = useStore();

  const filtros: Array<{
    id: FiltroRapidoType;
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    count: number;
  }> = [
    {
      id: 'todos',
      label: 'Todos',
      icon: Filter,
      color: 'text-gray-300',
      bgColor: 'bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/30',
      count: stats.totalProyectos
    },
    {
      id: 'criticos',
      label: 'Críticos',
      icon: AlertTriangle,
      color: 'text-red-300',
      bgColor: 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30',
      count: stats.criticos
    },
    {
      id: 'enRiesgo',
      label: 'En Riesgo',
      icon: TrendingUp,
      color: 'text-orange-300',
      bgColor: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30',
      count: stats.enRiesgo
    },
    {
      id: 'enObservacion',
      label: 'En Observación',
      icon: Eye,
      color: 'text-yellow-300',
      bgColor: 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30',
      count: stats.enObservacion
    },
    {
      id: 'normal',
      label: 'Normal',
      icon: CheckCircle,
      color: 'text-green-300',
      bgColor: 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30',
      count: stats.normales
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          Filtro Rápido
        </h3>
        {filtroRapido !== 'todos' && (
          <button
            onClick={() => setFiltroRapido('todos')}
            className="text-xs text-gray-400 hover:text-white transition-colors underline"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtros.map((filtro) => {
          const Icon = filtro.icon;
          const isActive = filtroRapido === filtro.id;

          return (
            <button
              key={filtro.id}
              onClick={() => setFiltroRapido(filtro.id)}
              className={`
                relative overflow-hidden rounded-xl p-4 border transition-all duration-200
                ${isActive 
                  ? `${filtro.bgColor} ring-2 ring-white/30 scale-105` 
                  : `${filtro.bgColor} opacity-70 hover:opacity-100`
                }
              `}
            >
              {/* Indicador de activo */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                </div>
              )}

              {/* Contenido */}
              <div className="flex flex-col items-center gap-2">
                <Icon className={`w-6 h-6 ${filtro.color}`} />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {filtro.count}
                  </div>
                  <div className="text-xs text-gray-300 font-medium">
                    {filtro.label}
                  </div>
                </div>
              </div>

              {/* Efecto hover */}
              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
            </button>
          );
        })}
      </div>

      {/* Info del filtro activo */}
      {filtroRapido !== 'todos' && (
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <p className="text-sm text-blue-300">
            📊 Mostrando proyectos con criticidad: <span className="font-bold">{filtros.find(f => f.id === filtroRapido)?.label}</span>
          </p>
        </div>
      )}
    </div>
  );
}