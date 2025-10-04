// components/RecomendacionesIA.tsx

import React from 'react';
import { X, Brain, TrendingUp, AlertCircle, Lightbulb, Target } from 'lucide-react';

interface Recomendacion {
  id: string;
  tipo: 'mitigacion' | 'optimizacion' | 'preventiva' | 'estrategica';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  proyectosAfectados: string[];
  acciones: string[];
  impactoEstimado: string;
  confianza: number;
}

interface RecomendacionesIAProps {
  isOpen: boolean;
  onClose: () => void;
}

const recomendacionesEjemplo: Recomendacion[] = [
  {
    id: '1',
    tipo: 'preventiva',
    prioridad: 'alta',
    titulo: 'Riesgo de escalamiento en gestión predial',
    descripcion: 'El modelo predictivo identifica alta probabilidad (78%) de escalamiento a CRÍTICO en los próximos 30 días para proyectos con disponibilidad predial menor al 60%.',
    proyectosAfectados: ['Accesos Norte II', 'Puerto de Buenaventura'],
    acciones: [
      'Acelerar gestión predial en UF 1-5 del proyecto Accesos Norte II',
      'Contactar IDU para expeditar entrega de predios Cra 7a',
      'Revisar Convenio 006 de 2019 con equipo jurídico',
      'Programar reunión con Distrito en próximos 15 días',
    ],
    impactoEstimado: 'Reducción del 60% en riesgo de retrasos',
    confianza: 0.78,
  },
  {
    id: '2',
    tipo: 'mitigacion',
    prioridad: 'alta',
    titulo: 'Compensaciones ambientales en mora - Plan de acción inmediato',
    descripcion: 'Se detectó patrón crítico en cumplimiento de obligaciones ambientales. Requiere intervención inmediata para evitar sanciones ANLA.',
    proyectosAfectados: ['Puerto de Buenaventura'],
    acciones: [
      'Convocar mesa técnica con ANLA en máximo 5 días hábiles',
      'Actualizar cronograma de compensaciones ambientales',
      'Asignar recursos adicionales al equipo ambiental',
      'Implementar sistema de seguimiento semanal',
    ],
    impactoEstimado: 'Evitar sanciones estimadas en $2.5M USD',
    confianza: 0.92,
  },
  {
    id: '3',
    tipo: 'optimizacion',
    prioridad: 'media',
    titulo: 'Replicar estrategia exitosa de tarifas diferenciales',
    descripcion: 'El proyecto Accesos Cali Palmira muestra resultados positivos en relacionamiento comunitario mediante tarifas diferenciales coordinadas con autoridades locales.',
    proyectosAfectados: ['Accesos Norte I', 'Accesos Norte II', 'Autopista al Mar 2'],
    acciones: [
      'Documentar lecciones aprendidas del caso Cali Palmira',
      'Adaptar modelo a contextos de otros proyectos',
      'Capacitar equipos sociales en mejores prácticas',
      'Establecer mesas de diálogo permanentes',
    ],
    impactoEstimado: 'Mejora del 35% en indicadores sociales',
    confianza: 0.85,
  },
  {
    id: '4',
    tipo: 'estrategica',
    prioridad: 'media',
    titulo: 'Optimizar recursos entre proyectos en fase similar',
    descripcion: 'Análisis de eficiencia identifica oportunidad de compartir recursos técnicos entre proyectos carreteros en fase de operación.',
    proyectosAfectados: ['Accesos Norte II', 'Autopista al Mar 2'],
    acciones: [
      'Evaluar compartir equipo técnico especializado',
      'Consolidar interventorías donde sea posible',
      'Implementar plataforma colaborativa de gestión',
    ],
    impactoEstimado: 'Ahorro estimado: $450K USD anuales',
    confianza: 0.71,
  },
];

export default function RecomendacionesIA({ isOpen, onClose }: RecomendacionesIAProps) {
  if (!isOpen) return null;

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-500/20 text-red-300 border-red-400/50';
      case 'media':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50';
      case 'baja':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/50';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'preventiva':
        return AlertCircle;
      case 'mitigacion':
        return Target;
      case 'optimizacion':
        return TrendingUp;
      case 'estrategica':
        return Lightbulb;
      default:
        return Brain;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Recomendaciones Inteligentes</h2>
              <p className="text-sm text-gray-400 mt-1">
                Generadas por IA basándose en análisis de {recomendacionesEjemplo.length} patrones detectados
              </p>
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
          {recomendacionesEjemplo.map((recomendacion) => {
            const IconoTipo = getTipoIcon(recomendacion.tipo);
            
            return (
              <div
                key={recomendacion.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              >
                {/* Header de recomendación */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <IconoTipo className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{recomendacion.titulo}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getPrioridadColor(recomendacion.prioridad)}`}>
                          Prioridad {recomendacion.prioridad}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {recomendacion.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  {/* Score de confianza */}
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.round(recomendacion.confianza * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Confianza IA</div>
                  </div>
                </div>

                {/* Proyectos afectados */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-400 mb-2">PROYECTOS AFECTADOS:</div>
                  <div className="flex flex-wrap gap-2">
                    {recomendacion.proyectosAfectados.map((proyecto, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg font-medium"
                      >
                        {proyecto}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Acciones recomendadas */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-400 mb-3">ACCIONES RECOMENDADAS:</div>
                  <div className="space-y-2">
                    {recomendacion.acciones.map((accion, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        <span className="text-sm text-gray-300">{accion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impacto estimado */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">
                      {recomendacion.impactoEstimado}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-semibold transition-colors">
                      Ver detalles
                    </button>
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors">
                      Implementar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Nota:</strong> Estas recomendaciones se actualizan diariamente basándose en análisis predictivo
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}