// components/components/PanelSeguimiento.tsx

'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Proyecto } from '@/types';
import { Star, Eye, MapPin, Trash2, FileText } from 'lucide-react';
import CriticidadBadge from './CriticidadBadge';

interface PanelSeguimientoProps {
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export default function PanelSeguimiento({ onSelectProyecto }: PanelSeguimientoProps) {
  const { proyectos, seguimientos, toggleSeguimiento, obtenerNotasProyecto } = useStore();

  const proyectosEnSeguimiento = proyectos.filter(p => 
    seguimientos.some(s => s.proyectoId === p.id && s.enSeguimiento)
  );

  if (proyectosEnSeguimiento.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
        <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          No hay proyectos en seguimiento
        </h3>
        <p className="text-gray-400 mb-6">
          Agrega proyectos a tu lista de seguimiento haciendo clic en la estrella ⭐
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
          💡 Los proyectos críticos se muestran en el panel de atención urgente
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Mis Proyectos en Seguimiento
            </h2>
            <p className="text-sm text-gray-400">
              {proyectosEnSeguimiento.length} proyecto{proyectosEnSeguimiento.length !== 1 ? 's' : ''} bajo tu seguimiento activo
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {proyectosEnSeguimiento.map(proyecto => {
          const seguimiento = seguimientos.find(s => s.proyectoId === proyecto.id);
          const notas = obtenerNotasProyecto(proyecto.id);
          const ultimaNota = notas.length > 0 ? notas[notas.length - 1] : null;

          return (
            <div
              key={proyecto.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{proyecto.numero}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-medium text-gray-300">
                        {proyecto.tipoProyecto}
                      </span>
                        {proyecto.criticidadGeneral && (
                        <CriticidadBadge criticidad={proyecto.criticidadGeneral} size="sm" />
                        )}
                    </div>

                    <div className="px-3 py-1 bg-slate-700/50 rounded-lg">
                      <span className="text-xs text-gray-300">
                        Puntaje: <span className="font-bold text-white">{proyecto.puntajeTotal}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {proyecto.nombre}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {proyecto.alcanceTerritorial}
                    </span>
                    <span>•</span>
                    <span>{proyecto.etapaActual}</span>
                    <span>•</span>
                    <span>{proyecto.generacion}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>{notas.length} nota{notas.length !== 1 ? 's' : ''}</span>
                    </div>
                    
                    {seguimiento?.fechaAgregado && (
                      <div className="text-gray-500">
                        Agregado: {new Date(seguimiento.fechaAgregado).toLocaleDateString('es-CO')}
                      </div>
                    )}
                  </div>

                  {ultimaNota && (
                    <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-300">
                          Última nota:
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(ultimaNota.fecha).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {ultimaNota.texto}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => onSelectProyecto(proyecto)}
                    className="p-2 bg-blue-500/30 hover:bg-blue-500/40 border border-blue-500 rounded-lg transition-colors text-blue-200"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => toggleSeguimiento(proyecto.id)}
                    className="p-2 bg-red-500/30 hover:bg-red-500/40 border border-red-500 rounded-lg transition-colors text-red-200"
                    title="Quitar de seguimiento"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-4">
        <p className="text-sm text-blue-300">
          💡 <span className="font-semibold">Tip:</span> Haz clic en cualquier proyecto para agregar notas de seguimiento y ver su historial completo.
        </p>
      </div>
    </div>
  );
}