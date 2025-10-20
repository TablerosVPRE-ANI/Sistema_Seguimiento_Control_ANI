// components/components/PanelCriticos.tsx

'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Proyecto } from '@/types';
import { AlertTriangle, ChevronDown, ChevronUp, Star, Eye, MapPin } from 'lucide-react';

interface PanelCriticosProps {
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export default function PanelCriticos({ onSelectProyecto }: PanelCriticosProps) {
  const { proyectos, toggleSeguimiento, estaEnSeguimiento } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  // Filtrar proyectos críticos (puntaje >= 17)
  const proyectosCriticos = proyectos
    .filter(p => p.puntajeTotal >= 17)
    .sort((a, b) => b.puntajeTotal - a.puntajeTotal); // Ordenar por puntaje descendente

  // Si no hay proyectos críticos, no mostrar el panel
  if (proyectosCriticos.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl border-2 border-red-500/30 overflow-hidden">
      {/* Header - Siempre visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-red-500/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 rounded-xl animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🚨 Proyectos Críticos - Atención Urgente
            </h2>
            <p className="text-sm text-red-200">
              {proyectosCriticos.length} proyecto{proyectosCriticos.length !== 1 ? 's' : ''} requiere{proyectosCriticos.length === 1 ? '' : 'n'} atención inmediata (Puntaje ≥ 17)
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-red-300" />
          ) : (
            <ChevronDown className="w-6 h-6 text-red-300" />
          )}
        </button>
      </div>

      {/* Lista de proyectos críticos */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-3">
          {proyectosCriticos.map((proyecto, index) => {
            const enSeguimiento = estaEnSeguimiento(proyecto.id);

            return (
              <div
                key={proyecto.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-red-500/20 p-4 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Info del proyecto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Ranking badge */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      
                      {/* Puntaje */}
                      <div className="flex-shrink-0">
                        <div className="px-3 py-1 bg-red-500/30 border border-red-500 rounded-lg">
                          <span className="text-sm font-semibold text-red-200">
                            Puntaje: <span className="text-red-100 font-bold">{proyecto.puntajeTotal}/20</span>
                          </span>
                        </div>
                      </div>

                      {/* Badge de seguimiento */}
                      {enSeguimiento && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
                          <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                          <span className="text-xs text-yellow-200 font-medium">En seguimiento</span>
                        </div>
                      )}
                    </div>

                    {/* Nombre y ubicación */}
                    <div className="mb-2">
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                        {proyecto.nombre}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {proyecto.alcanceTerritorial}
                        </span>
                        <span>•</span>
                        <span>{proyecto.tipoProyecto}</span>
                        <span>•</span>
                        <span className="font-medium">{proyecto.etapaActual}</span>
                      </div>
                    </div>

                    {/* GITs problemáticos */}
                    <div className="flex flex-wrap gap-2">
                      {proyecto.evaluaciones
                        .filter(e => e.criticidad === 'CRÍTICO' || e.criticidad === 'EN RIESGO')
                        .map(evaluacion => (
                          <span
                            key={evaluacion.git}
                            className={`
                              inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold
                              ${evaluacion.criticidad === 'CRÍTICO'
                                ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                                : 'bg-orange-500/30 text-orange-200 border border-orange-500/50'
                              }
                            `}
                          >
                            {evaluacion.git}: {evaluacion.criticidad}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {/* Botón seguimiento */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSeguimiento(proyecto.id);
                      }}
                      className={`
                        p-2 rounded-lg transition-all duration-200 border
                        ${enSeguimiento
                          ? 'bg-yellow-500/30 border-yellow-500 hover:bg-yellow-500/40 text-yellow-200'
                          : 'bg-white/5 border-white/10 hover:bg-yellow-500/20 hover:border-yellow-500/50 text-gray-300 hover:text-yellow-200'
                        }
                      `}
                      title={enSeguimiento ? 'Quitar de seguimiento' : 'Agregar a seguimiento'}
                    >
                      <Star className={`w-5 h-5 ${enSeguimiento ? 'fill-yellow-300' : ''}`} />
                    </button>

                    {/* Botón ver detalles */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProyecto(proyecto);
                      }}
                      className="p-2 bg-blue-500/30 hover:bg-blue-500/40 border border-blue-500 rounded-lg transition-colors text-blue-200"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Footer con recomendación */}
          <div className="mt-4 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
            <p className="text-sm text-red-200">
              💡 <span className="font-semibold">Recomendación:</span> Estos proyectos requieren atención inmediata. 
              Considera agregarlos a seguimiento y crear planes de acción correctiva.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}