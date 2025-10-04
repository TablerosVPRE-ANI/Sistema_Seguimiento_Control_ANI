// components/ProyectoModal.tsx

import React from 'react';
import { X, MapPin, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Proyecto } from '@/types';
import CriticidadBadge from './CriticidadBadge';

interface ProyectoModalProps {
  proyecto: Proyecto | null;
  onClose: () => void;
}

export default function ProyectoModal({ proyecto, onClose }: ProyectoModalProps) {
  if (!proyecto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-start justify-between z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-gray-400">
                Proyecto #{proyecto.numero}
              </span>
              {proyecto.criticidadGeneral && (
                <CriticidadBadge criticidad={proyecto.criticidadGeneral} />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{proyecto.nombre}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {proyecto.alcanceTerritorial}
              </span>
              <span>•</span>
              <span>{proyecto.tipoProyecto}</span>
              <span>•</span>
              <span>{proyecto.etapaActual}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Generación</div>
              <div className="text-xl font-bold text-white">{proyecto.generacion}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Etapa Actual</div>
              <div className="text-xl font-bold text-white">{proyecto.etapaActual}</div>
            </div>
          </div>

          {/* Avances */}
          {(proyecto.avanceFisico !== undefined || proyecto.avanceFinanciero !== undefined) && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Avances del Proyecto
              </h3>
              <div className="space-y-4">
                {proyecto.avanceFisico !== undefined && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Avance Físico</span>
                      <span className="text-sm font-bold text-blue-400">{proyecto.avanceFisico}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${proyecto.avanceFisico}%` }}
                      />
                    </div>
                  </div>
                )}
                {proyecto.avanceFinanciero !== undefined && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Avance Financiero</span>
                      <span className="text-sm font-bold text-green-400">{proyecto.avanceFinanciero}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${proyecto.avanceFinanciero}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Evaluaciones por GIT */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              Evaluaciones por GIT
            </h3>
            <div className="space-y-4">
              {proyecto.evaluaciones.map((evaluacion, idx) => (
                <div
                  key={idx}
                  className="bg-black/30 rounded-lg p-4 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{evaluacion.git}</span>
                      <CriticidadBadge criticidad={evaluacion.criticidad} size="sm" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  {evaluacion.estado && (
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {evaluacion.estado}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
            Editar Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}