'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { mockProyectos } from '@/lib/mockData';
import StatCard from '@/components/components/StatCard';
import Filtros from '@/components/components/Filtros';
import ProyectosTable from '@/components/components/ProyectosTable';
import CriticidadBadge from '@/components/components/CriticidadBadge';
import ProyectoModal from '@/components/components/ProyectoModal';
import AlertasPanel from '@/components/components/AlertasPanel';
import RecomendacionesIA from '@/components/components/RecomendacionesIA';
import ExcelUploader from '@/components/components/ExcelUploader';
import ExcelPredialUploader from '@/components/components/ExcelPredialUploader';
import ViewSelector from '@/components/components/ViewSelector';
import StatCardsGIT from '@/components/components/StatCardsGIT';
import ProyectosTableGIT from '@/components/components/ProyectosTableGIT';
import FiltroRapido from '@/components/components/FiltroRapido';
import PanelCriticos from '@/components/components/PanelCriticos';
import PanelSeguimiento from '@/components/components/PanelSeguimiento';
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  FolderKanban,
  Bell,
  Brain,
  Shield,
  Upload,
  Star,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    proyectosFiltrados,
    stats,
    filtros,
    vistaActual,
    selectedProyecto,
    setProyectos,
    setFiltros,
    setSelectedProyecto,
    setVistaActual,
    seguimientos,
    cargarDatosPrediales,
  } = useStore();

  const [showAlertas, setShowAlertas] = useState(false);
  const [showRecomendaciones, setShowRecomendaciones] = useState(false);
  const [showExcelUploader, setShowExcelUploader] = useState(false);
  const [showExcelPredialUploader, setShowExcelPredialUploader] = useState(false);

  useEffect(() => {
    setProyectos(mockProyectos);
  }, [setProyectos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="data:image/png;base64,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"
                alt="Logo ANI" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">Sistema de Gestión ANI</h1>
                <p className="text-sm text-gray-400">
                  Dashboard Gerencial - Vicepresidencia de Planeación, Riesgos y Entorno
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExcelUploader(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Cargar Excel
              </button>
              
              <button
                onClick={() => setShowExcelPredialUploader(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Datos Prediales
              </button>
              
              <button 
                onClick={() => setShowAlertas(true)}
                className="relative p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-300" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {stats.alertasActivas}
                </span>
              </button>

              <button 
                onClick={() => setVistaActual('seguimiento')}
                className="relative p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Star className={`w-6 h-6 ${vistaActual === 'seguimiento' ? 'text-yellow-300 fill-yellow-300' : 'text-gray-300'}`} />
                {seguimientos.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {seguimientos.length}
                  </span>
                )}
              </button>
              
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  VP
                </div>
                <span className="text-sm font-medium">VPRE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex justify-center">
          <ViewSelector />
        </div>

        {vistaActual !== 'seguimiento' && (
          <FiltroRapido />
        )}

        {vistaActual === 'general' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Proyectos"
                value={stats.totalProyectos}
                icon={FolderKanban}
                description="Activos en el sistema"
                color="blue"
              />
              <StatCard
                title="Críticos"
                value={stats.criticos}
                icon={AlertTriangle}
                description="Requieren atención inmediata"
                color="red"
              />
              <StatCard
                title="En Riesgo"
                value={stats.enRiesgo}
                icon={TrendingUp}
                description="Monitoreo constante"
                color="yellow"
              />
              <StatCard
                title="Alertas Activas"
                value={stats.alertasActivas}
                icon={Bell}
                description="Proyectos con incidencias"
                color="purple"
              />
            </div>

            <PanelCriticos onSelectProyecto={setSelectedProyecto} />

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Distribución de Criticidad por GIT
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="text-3xl font-bold text-red-400 mb-2">{stats.criticos}</div>
                  <CriticidadBadge criticidad="CRÍTICO" size="sm" />
                </div>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{stats.enRiesgo}</div>
                  <CriticidadBadge criticidad="EN RIESGO" size="sm" />
                </div>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.enObservacion}</div>
                  <CriticidadBadge criticidad="EN OBSERVACIÓN" size="sm" />
                </div>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.normales}</div>
                  <CriticidadBadge criticidad="NORMAL" size="sm" />
                </div>
              </div>
            </div>

            <Filtros filtros={filtros} onFiltrosChange={setFiltros} />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Proyectos - Vista General VPRE ({proyectosFiltrados.length})
                </h2>
                <button 
                  onClick={() => setShowRecomendaciones(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Brain className="w-5 h-5" />
                  Ver Recomendaciones IA
                </button>
              </div>
              <ProyectosTable
                proyectos={proyectosFiltrados}
                onSelectProyecto={setSelectedProyecto}
              />
            </div>
          </>
        ) : vistaActual === 'git' ? (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Estadísticas por GIT
              </h2>
              <StatCardsGIT />
            </div>

            <Filtros filtros={filtros} onFiltrosChange={setFiltros} />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Proyectos - Vista por GIT ({proyectosFiltrados.length})
                </h2>
                <button 
                  onClick={() => setShowRecomendaciones(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Brain className="w-5 h-5" />
                  Ver Recomendaciones IA
                </button>
              </div>
              <ProyectosTableGIT
                proyectos={proyectosFiltrados}
                onSelectProyecto={setSelectedProyecto}
              />
            </div>
          </>
        ) : (
          <>
            <PanelSeguimiento onSelectProyecto={setSelectedProyecto} />
          </>
        )}
      </main>

      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-400">
            Sistema de Gestión de Proyectos ANI - {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <ProyectoModal
        proyecto={selectedProyecto}
        onClose={() => setSelectedProyecto(null)}
      />
      
      <AlertasPanel
        isOpen={showAlertas}
        onClose={() => setShowAlertas(false)}
      />
      
      <RecomendacionesIA
        isOpen={showRecomendaciones}
        onClose={() => setShowRecomendaciones(false)}
      />
      
      <ExcelUploader
        isOpen={showExcelUploader}
        onDataLoaded={(proyectos) => {
          setProyectos(proyectos);
          setShowExcelUploader(false);
        }}
        onClose={() => setShowExcelUploader(false)}
      />

      <ExcelPredialUploader
        isOpen={showExcelPredialUploader}
        onDataLoaded={(resumenes) => {
          cargarDatosPrediales(resumenes);
          setShowExcelPredialUploader(false);
        }}
        onClose={() => setShowExcelPredialUploader(false)}
      />
    </div>
  );
}