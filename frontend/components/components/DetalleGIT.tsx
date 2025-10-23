// components/components/DetalleGIT.tsx

'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { TipoGIT, Proyecto, Criticidad } from '@/types';
import { X, AlertTriangle, TrendingUp, Eye, MapPin } from 'lucide-react';
import CriticidadBadge from './CriticidadBadge';

interface DetalleGITProps {
  git: TipoGIT | null;
  criticidadFiltro?: Criticidad | null; // ✅ NUEVO: Filtro opcional de criticidad
  onClose: () => void;
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export default function DetalleGIT({ git, criticidadFiltro, onClose, onSelectProyecto }: DetalleGITProps) {
  const { proyectos } = useStore();

  if (!git) return null;

  // Filtrar proyectos que tienen este GIT evaluado
  let proyectosConGIT = proyectos
    .filter(p => p.evaluaciones.some(e => e.git === git))
    .map(p => {
      const evaluacionGIT = p.evaluaciones.find(e => e.git === git);
      return { proyecto: p, evaluacion: evaluacionGIT! };
    });

  // ✅ NUEVO: Filtrar por criticidad si se especifica
  if (criticidadFiltro) {
    proyectosConGIT = proyectosConGIT.filter(p => p.evaluacion.criticidad === criticidadFiltro);
  }

  // Ordenar por criticidad
  proyectosConGIT.sort((a, b) => {
    const orden = { 'CRÍTICO': 4, 'EN RIESGO': 3, 'EN OBSERVACIÓN': 2, 'NORMAL': 1 };
    return orden[b.evaluacion.criticidad] - orden[a.evaluacion.criticidad];
  });

  // Estadísticas
  const criticos = proyectosConGIT.filter(p => p.evaluacion.criticidad === 'CRÍTICO');
  const enRiesgo = proyectosConGIT.filter(p => p.evaluacion.criticidad === 'EN RIESGO');
  const enObservacion = proyectosConGIT.filter(p => p.evaluacion.criticidad === 'EN OBSERVACIÓN');
  const normales = proyectosConGIT.filter(p => p.evaluacion.criticidad === 'NORMAL');

  // Colores según GIT
  const getGITColor = (git: TipoGIT) => {
    const colores = {
      'Social': { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-300', icon: 'text-purple-400' },
      'JPredial': { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300', icon: 'text-blue-400' },
      'Predial': { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-300', icon: 'text-cyan-400' },
      'Ambiental': { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-300', icon: 'text-green-400' },
      'Riesgos': { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-300', icon: 'text-red-400' },
      'Valorizacion': { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: 'text-yellow-400' },
    };
    return colores[git];
  };

  const color = getGITColor(git);

  // ✅ Título dinámico según filtro
  const getTitulo = () => {
    if (criticidadFiltro) {
      return `GIT ${git} - ${criticidadFiltro}`;
    }
    return `GIT ${git}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`${color.bg} border-b ${color.border} p-6`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-3xl font-bold ${color.text} mb-2`}>
                {getTitulo()}
              </h2>
              <p className="text-gray-300">
                {proyectosConGIT.length} proyecto{proyectosConGIT.length !== 1 ? 's' : ''} 
                {criticidadFiltro && ` con criticidad ${criticidadFiltro}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Estadísticas rápidas - Solo si NO hay filtro */}
          {!criticidadFiltro && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-red-400">{criticos.length}</div>
                <div className="text-xs text-gray-400">Críticos</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-orange-400">{enRiesgo.length}</div>
                <div className="text-xs text-gray-400">En Riesgo</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">{enObservacion.length}</div>
                <div className="text-xs text-gray-400">En Observación</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-green-400">{normales.length}</div>
                <div className="text-xs text-gray-400">Normal</div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de proyectos */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {proyectosConGIT.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {criticidadFiltro 
                  ? `No hay proyectos ${criticidadFiltro} para este GIT`
                  : 'No hay proyectos con evaluación de este GIT'
                }
              </div>
            ) : (
              proyectosConGIT.map(({ proyecto, evaluacion }) => (
                <div
                  key={proyecto.id}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header del proyecto */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-400">
                          #{proyecto.numero}
                        </span>
                        <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-medium text-gray-300">
                          {proyecto.tipoProyecto}
                        </span>
                        <CriticidadBadge criticidad={evaluacion.criticidad} size="sm" />
                      </div>

                      {/* Nombre del proyecto */}
                      <h3 className="text-base font-bold text-white mb-2">
                        {proyecto.nombre}
                      </h3>

                      {/* Info adicional */}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {proyecto.alcanceTerritorial}
                        </span>
                        <span>•</span>
                        <span>{proyecto.etapaActual}</span>
                      </div>

                      {/* Estado del GIT */}
                      {evaluacion.estado && (
                        <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                          <div className="text-xs text-gray-500 mb-1">Estado actual del GIT:</div>
                          <p className="text-sm text-gray-300">
                            {evaluacion.estado}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botón ver detalles */}
                    <button
                      onClick={() => {
                        onSelectProyecto(proyecto);
                        onClose();
                      }}
                      className={`p-2 ${color.bg} hover:opacity-80 border ${color.border} rounded-lg transition-colors ${color.text}`}
                      title="Ver detalles completos"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 bg-black/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              💡 {criticidadFiltro 
                ? `Mostrando solo proyectos ${criticidadFiltro}` 
                : 'Proyectos ordenados por criticidad'
              }
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}