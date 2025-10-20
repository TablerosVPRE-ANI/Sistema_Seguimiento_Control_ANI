// app/page.tsx

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
import ViewSelector from '@/components/components/ViewSelector';
import StatCardsGIT from '@/components/components/StatCardsGIT';
import ProyectosTableGIT from '@/components/components/ProyectosTableGIT';
// ✅ FASE 1: Nuevos imports
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
    setVistaActual, // ✅ NUEVO
    seguimientos, // ✅ NUEVO
  } = useStore();

  const [showAlertas, setShowAlertas] = useState(false);
  const [showRecomendaciones, setShowRecomendaciones] = useState(false);
  const [showExcelUploader, setShowExcelUploader] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    setProyectos(mockProyectos);
  }, [setProyectos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-400" />
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
                onClick={() => setShowAlertas(true)}
                className="relative p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-300" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {stats.alertasActivas}
                </span>
              </button>

              {/* ✅ FASE 1: Botón de seguimiento */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ✅ Selector de Vista */}
        <div className="flex justify-center">
          <ViewSelector />
        </div>

        {/* ✅ FASE 1: Filtro Rápido - Solo en vistas general y git */}
        {vistaActual !== 'seguimiento' && (
          <FiltroRapido />
        )}

        {/* ✅ RENDERIZADO CONDICIONAL SEGÚN VISTA */}
        {vistaActual === 'general' ? (
          <>
            {/* Vista General VPRE */}
            {/* KPIs */}
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

            {/* ✅ FASE 1: Panel de Proyectos Críticos */}
            <PanelCriticos onSelectProyecto={setSelectedProyecto} />

            {/* Distribución de Criticidad */}
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

            {/* Filtros */}
            <Filtros filtros={filtros} onFiltrosChange={setFiltros} />

            {/* Tabla de Proyectos - Vista General */}
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
            {/* Vista por GIT */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Estadísticas por GIT
              </h2>
              <StatCardsGIT />
            </div>

            {/* Filtros */}
            <Filtros filtros={filtros} onFiltrosChange={setFiltros} />

            {/* Tabla de Proyectos - Vista por GIT */}
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
            {/* ✅ FASE 1: Vista de Seguimiento */}
            <PanelSeguimiento onSelectProyecto={setSelectedProyecto} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-400">
            Sistema de Gestión de Proyectos ANI - {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Modales y Paneles */}
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
    </div>
  );
}