// components/ProyectosTable.tsx

import React from 'react';
import { Proyecto } from '@/types';
import CriticidadBadge from './CriticidadBadge';
import { Eye, MapPin } from 'lucide-react';

interface ProyectosTableProps {
  proyectos: Proyecto[];
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export default function ProyectosTable({
  proyectos,
  onSelectProyecto,
}: ProyectosTableProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Nº
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Etapa
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Criticidad
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Avance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {proyecto.numero}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {proyecto.nombre}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {proyecto.alcanceTerritorial}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {proyecto.tipoProyecto}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {proyecto.etapaActual}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {proyecto.criticidadGeneral ? (
                    <CriticidadBadge
                      criticidad={proyecto.criticidadGeneral}
                      size="sm"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No definido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {proyecto.avanceFisico !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-12">Físico:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2 w-24">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${proyecto.avanceFisico}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-300 w-10 text-right">
                          {proyecto.avanceFisico}%
                        </span>
                      </div>
                    )}
                    {proyecto.avanceFinanciero !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-12">Financ:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2 w-24">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${proyecto.avanceFinanciero}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-300 w-10 text-right">
                          {proyecto.avanceFinanciero}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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