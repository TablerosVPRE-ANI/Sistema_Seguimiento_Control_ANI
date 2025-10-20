// components/components/NotasProyecto.tsx

'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { NotaProyecto } from '@/types';
import { FileText, Send, Clock, User, Tag } from 'lucide-react';

interface NotasProyectoProps {
  proyectoId: string;
}

export default function NotasProyecto({ proyectoId }: NotasProyectoProps) {
  const { agregarNota, obtenerNotasProyecto } = useStore();
  const [textoNota, setTextoNota] = useState('');
  const [tipoNota, setTipoNota] = useState<'seguimiento' | 'accion' | 'observacion' | 'reunion'>('seguimiento');

  const notas = obtenerNotasProyecto(proyectoId);

  const handleAgregarNota = () => {
    if (textoNota.trim() === '') return;

    agregarNota(proyectoId, {
      texto: textoNota,
      tipo: tipoNota,
      autor: 'VPRE' // Podría ser dinámico según el usuario
    });

    setTextoNota('');
    setTipoNota('seguimiento');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAgregarNota();
    }
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoColor = (tipo: NotaProyecto['tipo']) => {
    const colores = {
      seguimiento: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      accion: 'bg-green-500/20 text-green-300 border-green-500/30',
      observacion: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      reunion: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colores[tipo];
  };

  const getTipoLabel = (tipo: NotaProyecto['tipo']) => {
    const labels = {
      seguimiento: '📋 Seguimiento',
      accion: '✅ Acción',
      observacion: '👁 Observación',
      reunion: '🤝 Reunión'
    };
    return labels[tipo];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Notas y Seguimiento</h3>
          <p className="text-sm text-gray-400">
            {notas.length} nota{notas.length !== 1 ? 's' : ''} registrada{notas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Formulario para agregar nota */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4">
        <div className="space-y-3">
          {/* Selector de tipo */}
          <div className="flex flex-wrap gap-2">
            {(['seguimiento', 'accion', 'observacion', 'reunion'] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoNota(tipo)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
                  ${tipoNota === tipo
                    ? getTipoColor(tipo)
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }
                `}
              >
                {getTipoLabel(tipo)}
              </button>
            ))}
          </div>

          {/* Campo de texto */}
          <textarea
            value={textoNota}
            onChange={(e) => setTextoNota(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe una nota sobre este proyecto... (Ctrl+Enter para enviar)"
            rows={3}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          />

          {/* Botón enviar */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Presiona Ctrl+Enter para enviar rápidamente
            </span>
            <button
              onClick={handleAgregarNota}
              disabled={textoNota.trim() === ''}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Agregar Nota
            </button>
          </div>
        </div>
      </div>

      {/* Historial de notas */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Historial ({notas.length})
        </h4>

        {notas.length === 0 ? (
          <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No hay notas registradas aún</p>
            <p className="text-sm text-gray-500 mt-1">
              Agrega la primera nota de seguimiento para este proyecto
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {/* Ordenar por fecha descendente (más reciente primero) */}
            {[...notas].reverse().map((nota) => (
              <div
                key={nota.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors"
              >
                {/* Header de la nota */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tipo */}
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getTipoColor(nota.tipo)}`}>
                      {getTipoLabel(nota.tipo)}
                    </span>

                    {/* Autor */}
                    {nota.autor && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3 h-3" />
                        {nota.autor}
                      </span>
                    )}
                  </div>

                  {/* Fecha */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatearFecha(nota.fecha)}
                  </div>
                </div>

                {/* Contenido */}
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {nota.texto}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}