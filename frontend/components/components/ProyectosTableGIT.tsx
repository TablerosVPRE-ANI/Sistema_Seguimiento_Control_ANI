// components/ProyectosTableGIT.tsx

'use client';

import React from 'react';
import { Proyecto, Criticidad, TipoGIT } from '@/types';
import { Eye, MapPin } from 'lucide-react';

interface ProyectosTableGITProps {
  proyectos: Proyecto[];
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export default function ProyectosTableGIT({
  proyectos,
  onSelectProyecto,
}: ProyectosTableGITProps) {
  
  // Función para obtener el badge de criticidad
  const getCriticidadBadge = (criticidad: Criticidad | undefined) => {
    if (!criticidad) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-400">
          N/A
        </span>
      );
    }

    const styles = {
      'CRÍTICO': 'bg-red-500/20 text-red-300 border border-red-500/30',
      'EN RIESGO': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      'EN OBSERVACIÓN': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      'NORMAL': 'bg-green-500/20 text-green-300 border border-green-500/30'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${styles[criticidad]}`}>
        {criticidad}
      </span>
    );
  };

  // Obtener la criticidad de un GIT específico para un proyecto
  const getGITCriticidad = (proyecto: Proyecto, git: TipoGIT): Criticidad | undefined => {
    const evaluacion = proyecto.evaluaciones.find(e => e.git === git);
    return evaluacion?.criticidad;
  };

  const gitsArray: TipoGIT[] = ['Social', 'JPredial', 'Predial', 'Ambiental', 'Riesgos', 'Valorizacion'];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider sticky left-0 bg-slate-900/95 z-10">
                Nº
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider sticky left-16 bg-slate-900/95 z-10">
                Proyecto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              {/* Columnas por cada GIT */}
              {gitsArray.map(git => (
                <th key={git} className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {git}
                </th>
              ))}
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {proyectos.map((proyecto) => (
              <tr
                key={proyecto.id}
                className="hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => onSelectProyecto(proyecto)}
              >
                {/* Número */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 sticky left-0 bg-slate-900/95">
                  {proyecto.numero}
                </td>

                {/* Proyecto */}
                <td className="px-6 py-4 sticky left-16 bg-slate-900/95">
                  <div className="flex flex-col min-w-[250px]">
                    <span className="text-sm font-medium text-white">
                      {proyecto.nombre}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {proyecto.alcanceTerritorial}
                    </span>
                  </div>
                </td>

                {/* Tipo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {proyecto.tipoProyecto}
                  </span>
                </td>

                {/* Columnas de cada GIT */}
                {gitsArray.map(git => (
                  <td key={git} className="px-6 py-4 whitespace-nowrap text-center">
                    {getCriticidadBadge(getGITCriticidad(proyecto, git))}
                  </td>
                ))}

                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProyecto(proyecto);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {proyectos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No se encontraron proyectos</p>
        </div>
      )}
    </div>
  );
}