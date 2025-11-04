'use client';

import React, { useState } from 'react';
import { ResumenPredial, SectorPredial } from '@/types';
import { X, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, TrendingUp, Eye, FileText } from 'lucide-react';

interface SeguimientoPredialProps {
  resumen: ResumenPredial | null;
  onClose: () => void;
}

export default function SeguimientoPredial({ resumen, onClose }: SeguimientoPredialProps) {
  const [sectoresExpandidos, setSectoresExpandidos] = useState<Set<number>>(new Set());

  if (!resumen) return null;

  const toggleSector = (index: number) => {
    const nuevo = new Set(sectoresExpandidos);
    if (nuevo.has(index)) {
      nuevo.delete(index);
    } else {
      nuevo.add(index);
    }
    setSectoresExpandidos(nuevo);
  };

  const getEstadoColor = (estado: string) => {
    const colores = {
      'Completado': { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-300', icon: 'text-green-400' },
      'Avanzado': { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-300', icon: 'text-blue-400' },
      'En Progreso': { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-300', icon: 'text-yellow-400' },
      'Crítico': { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-300', icon: 'text-red-400' }
    };
    return colores[estado as keyof typeof colores] || colores['En Progreso'];
  };

  const getEstadoIcon = (estado: string) => {
    const iconos = {
      'Completado': CheckCircle,
      'Avanzado': TrendingUp,
      'En Progreso': Eye,
      'Crítico': AlertTriangle
    };
    return iconos[estado as keyof typeof iconos] || Eye;
  };

  const colorGeneral = getEstadoColor(resumen.estadoGeneral);
  const IconGeneral = getEstadoIcon(resumen.estadoGeneral);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className={`${colorGeneral.bg} border-b ${colorGeneral.border} p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 ${colorGeneral.bg} rounded-xl border ${colorGeneral.border}`}>
                  <FileText className={`w-6 h-6 ${colorGeneral.icon}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Seguimiento Predial
                  </h2>
                  <p className="text-lg text-gray-300">{resumen.proyectoNombre}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Generación: {resumen.generacion}</span>
                <span>•</span>
                <span>Actualizado: {resumen.ultimaActualizacion}</span>
                <span>•</span>
                <span>Técnico: {resumen.tecnicoACargo}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            
            <div className={`${colorGeneral.bg} border ${colorGeneral.border} rounded-xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <IconGeneral className={`w-5 h-5 ${colorGeneral.icon}`} />
                <h3 className="text-lg font-bold text-white">Resumen General</h3>
              </div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
    <div className="text-sm text-gray-400 mb-1">Longitud Efectiva Predial Total</div>
    <div className="text-2xl font-bold text-white">
      {resumen.totalLongitudEfectivaPredialKm.toFixed(2)} Km
    </div>
  </div>
  
  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
    <div className="text-sm text-gray-400 mb-1">Predios Adquiridos</div>
    <div className="text-2xl font-bold text-green-400">{resumen.totalPrediosAdquiridos}</div>
    <div className="text-xs text-green-300 mt-1">{resumen.totalPrediosAdquiridosPorcentaje}%</div>
  </div>
  
  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
    <div className="text-sm text-gray-400 mb-1">Predios Faltantes</div>
    <div className="text-2xl font-bold text-orange-400">{resumen.totalPrediosFaltantes}</div>
    <div className="text-xs text-orange-300 mt-1">{resumen.totalPrediosFaltantesPorcentaje}%</div>
  </div>
  
  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
    <div className="text-sm text-gray-400 mb-1">Longitud Efectiva Disponible</div>
    <div className="text-2xl font-bold text-blue-400">
      {resumen.totalLongitudEfectivaPredialDisponibleKm.toFixed(2)} Km
    </div>
    <div className="text-xs text-blue-300 mt-1">{resumen.totalLongitudEfectivaPredialDisponiblePorcentaje}%</div>
  </div>
</div>

              <div className="mt-4">
                <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${resumen.totalPrediosAdquiridosPorcentaje >= 95 ? 'bg-green-500' : resumen.totalPrediosAdquiridosPorcentaje >= 70 ? 'bg-blue-500' : resumen.totalPrediosAdquiridosPorcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'} transition-all duration-500`}
                    style={{ width: `${resumen.totalPrediosAdquiridosPorcentaje}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span className="font-bold text-white">{resumen.totalPrediosAdquiridosPorcentaje}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Detalle por Sectores ({resumen.sectores.length})
              </h3>

              <div className="space-y-3">
                {resumen.sectores.map((sector, index) => {
                  const expandido = sectoresExpandidos.has(index);
                  const colorSector = getEstadoColor(sector.estadoSector);
                  const IconSector = getEstadoIcon(sector.estadoSector);

                  return (
                    <div
                      key={index}
                      className={`${colorSector.bg} border ${colorSector.border} rounded-xl overflow-hidden transition-all duration-200`}
                    >
                      <button
                        onClick={() => toggleSector(index)}
                        className="w-full p-4 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <IconSector className={`w-5 h-5 ${colorSector.icon} mt-1 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white mb-2">{sector.unidadFuncional}</h4>
                              <div className="flex flex-wrap gap-3 text-sm">
                                <span className="text-gray-300">
                                  <span className="font-semibold">{sector.totalPrediosAdquiridos}</span>
                                  <span className="text-gray-500">/</span>
                                  <span className="font-semibold">{sector.prediosRequeridos}</span> predios
                                </span>
                                <span className={`font-bold ${colorSector.text}`}>
                                  {sector.totalPrediosAdquiridosPorcentaje}%
                                </span>
                                {sector.prediosFaltantesPorAdquirir > 0 && (
                                  <span className="text-orange-300">
                                    {sector.prediosFaltantesPorAdquirir} faltantes
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${colorSector.bg} ${colorSector.text} border ${colorSector.border}`}>
                              {sector.estadoSector}
                            </span>
                            {expandido ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      {expandido && (
                        <div className="px-4 pb-4 space-y-3 border-t border-white/10">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                              <div className="text-xs text-gray-400 mb-1">Enajenación Voluntaria</div>
                              <div className="text-lg font-bold text-white">{sector.prediosAdquiridosEnajenacionVoluntaria}</div>
                              {sector.prediosAdquiridosEnajenacionVoluntariaPorcentaje !== undefined && (
                                <div className="text-xs text-gray-400">{sector.prediosAdquiridosEnajenacionVoluntariaPorcentaje}%</div>
                              )}
                            </div>

                            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                              <div className="text-xs text-gray-400 mb-1">Expropiación Judicial</div>
                              <div className="text-lg font-bold text-white">{sector.prediosAdquiridosExpropiacionJudicial}</div>
                              {sector.prediosAdquiridosExpropiacionJudicialPorcentaje !== undefined && (
                                <div className="text-xs text-gray-400">{sector.prediosAdquiridosExpropiacionJudicialPorcentaje}%</div>
                              )}
                            </div>

                            {sector.prediosDisponibles !== undefined && (
                              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                <div className="text-xs text-gray-400 mb-1">Predios Disponibles</div>
                                <div className="text-lg font-bold text-white">{sector.prediosDisponibles}</div>
                                {sector.prediosDisponiblesPorcentaje !== undefined && (
                                  <div className="text-xs text-gray-400">{sector.prediosDisponiblesPorcentaje}%</div>
                                )}
                              </div>
                            )}
                          </div>

                          {sector.observaciones && (
                            <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Observaciones
                              </div>
                              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                {sector.observaciones}
                              </p>
                            </div>
                          )}

                          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${sector.totalPrediosAdquiridosPorcentaje >= 95 ? 'bg-green-500' : sector.totalPrediosAdquiridosPorcentaje >= 70 ? 'bg-blue-500' : sector.totalPrediosAdquiridosPorcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'} transition-all duration-500`}
                              style={{ width: `${sector.totalPrediosAdquiridosPorcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4 bg-black/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}