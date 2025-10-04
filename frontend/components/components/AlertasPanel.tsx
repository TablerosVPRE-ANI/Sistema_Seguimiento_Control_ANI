// components/AlertasPanel.tsx

import React from 'react';
import { X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import CriticidadBadge from './CriticidadBadge';

interface Alerta {
  id: string;
  tipo: 'criticidad' | 'vencimiento' | 'actualizacion';
  proyectoNombre: string;
  git?: string;
  mensaje: string;
  timestamp: string;
  leida: boolean;
  criticidad?: 'CRÍTICO' | 'EN RIESGO' | 'EN OBSERVACIÓN';
}

interface AlertasPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Datos de ejemplo de alertas
const alertasEjemplo: Alerta[] = [
  {
    id: '1',
    tipo: 'criticidad',
    proyectoNombre: 'Accesos Norte II',
    git: 'Valorización',
    mensaje: 'El proyecto escaló a nivel CRÍTICO en Valorización',
    timestamp: '2025-10-01T10:30:00',
    leida: false,
    criticidad: 'CRÍTICO',
  },
  {
    id: '2',
    tipo: 'criticidad',
    proyectoNombre: 'Puerto de Buenaventura',
    git: 'Ambiental',
    mensaje: 'Compensaciones ambientales en mora - seguimiento ANLA requerido',
    timestamp: '2025-10-01T09:15:00',
    leida: false,
    criticidad: 'CRÍTICO',
  },
  {
    id: '3',
    tipo: 'vencimiento',
    proyectoNombre: 'Autopista al Mar 2',
    mensaje: 'Vencimiento de licencia ambiental en 7 días',
    timestamp: '2025-10-01T08:00:00',
    leida: false,
  },
  {
    id: '4',
    tipo: 'actualizacion',
    proyectoNombre: 'Accesos Cali Palmira',
    mensaje: 'El proyecto no ha sido actualizado en 10 días',
    timestamp: '2025-09-30T16:45:00',
    leida: true,
  },
];

export default function AlertasPanel({ isOpen, onClose }: AlertasPanelProps) {
  const [alertas, setAlertas] = React.useState(alertasEjemplo);

  const marcarComoLeida = (id: string) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, leida: true } : a));
  };

  const marcarTodasComoLeidas = () => {
    setAlertas(alertas.map(a => ({ ...a, leida: true })));
  };

  const alertasNoLeidas = alertas.filter(a => !a.leida).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-white/20 shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Alertas</h2>
              <p className="text-sm text-gray-400 mt-1">
                {alertasNoLeidas} {alertasNoLeidas === 1 ? 'alerta no leída' : 'alertas no leídas'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          {alertasNoLeidas > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Lista de Alertas */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] p-6 space-y-4">
          {alertas.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-400">No hay alertas pendientes</p>
            </div>
          ) : (
            alertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`rounded-xl p-4 border transition-all cursor-pointer ${
                  alerta.leida
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                onClick={() => !alerta.leida && marcarComoLeida(alerta.id)}
              >
                {/* Header de la alerta */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    alerta.tipo === 'criticidad'
                      ? 'bg-red-500/20'
                      : alerta.tipo === 'vencimiento'
                      ? 'bg-yellow-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    {alerta.tipo === 'criticidad' ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : alerta.tipo === 'vencimiento' ? (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm">
                        {alerta.proyectoNombre}
                      </h3>
                      {!alerta.leida && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    
                    {alerta.git && (
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md font-medium">
                          {alerta.git}
                        </span>
                      </div>
                    )}
                    
                    {alerta.criticidad && (
                      <div className="mb-2">
                        <CriticidadBadge criticidad={alerta.criticidad} size="sm" />
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-300 mb-2">
                      {alerta.mensaje}
                    </p>
                    
                    <p className="text-xs text-gray-500">
                      {new Date(alerta.timestamp).toLocaleString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}