// lib/store.ts

import { create } from 'zustand';
import { Proyecto, FiltrosDashboard, DashboardStats } from '@/types';

interface AppState {
  // Datos
  proyectos: Proyecto[];
  proyectosFiltrados: Proyecto[];
  stats: DashboardStats;
  
  // Filtros
  filtros: FiltrosDashboard;
  
  // UI State
  loading: boolean;
  selectedProyecto: Proyecto | null;
  
  // Actions
  setProyectos: (proyectos: Proyecto[]) => void;
  setFiltros: (filtros: FiltrosDashboard) => void;
  aplicarFiltros: () => void;
  setSelectedProyecto: (proyecto: Proyecto | null) => void;
  calcularStats: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  proyectos: [],
  proyectosFiltrados: [],
  stats: {
    totalProyectos: 0,
    criticos: 0,
    enRiesgo: 0,
    enObservacion: 0,
    normales: 0,
    alertasActivas: 0,
    recomendacionesIA: 0,
  },
  filtros: {},
  loading: false,
  selectedProyecto: null,

  // Acciones
  setProyectos: (proyectos) => {
    set({ proyectos, proyectosFiltrados: proyectos });
    get().calcularStats();
  },

  setFiltros: (filtros) => {
    set({ filtros });
    get().aplicarFiltros();
  },

  aplicarFiltros: () => {
    const { proyectos, filtros } = get();
    let filtrados = [...proyectos];

    if (filtros.tipoProyecto && filtros.tipoProyecto.length > 0) {
      filtrados = filtrados.filter(p => 
        filtros.tipoProyecto!.includes(p.tipoProyecto)
      );
    }

    if (filtros.criticidad && filtros.criticidad.length > 0) {
      filtrados = filtrados.filter(p => 
        p.criticidadGeneral && filtros.criticidad!.includes(p.criticidadGeneral)
      );
    }

    if (filtros.git && filtros.git.length > 0) {
      filtrados = filtrados.filter(p =>
        p.evaluaciones.some(e => filtros.git!.includes(e.git))
      );
    }

    if (filtros.etapa && filtros.etapa.length > 0) {
      filtrados = filtrados.filter(p =>
        filtros.etapa!.includes(p.etapaActual)
      );
    }

    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const busqueda = filtros.busqueda.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.alcanceTerritorial.toLowerCase().includes(busqueda)
      );
    }

    set({ proyectosFiltrados: filtrados });
  },

  setSelectedProyecto: (proyecto) => {
    set({ selectedProyecto: proyecto });
  },

  calcularStats: () => {
    const { proyectos } = get();
    
    const stats: DashboardStats = {
      totalProyectos: proyectos.length,
      criticos: 0,
      enRiesgo: 0,
      enObservacion: 0,
      normales: 0,
      alertasActivas: 0,
      recomendacionesIA: 0,
    };

    proyectos.forEach(proyecto => {
      proyecto.evaluaciones.forEach(evaluacion => {
        switch (evaluacion.criticidad) {
          case 'CRÍTICO':
            stats.criticos++;
            break;
          case 'EN RIESGO':
            stats.enRiesgo++;
            break;
          case 'EN OBSERVACIÓN':
            stats.enObservacion++;
            break;
          case 'NORMAL':
            stats.normales++;
            break;
        }
      });
    });

    const proyectosConAlertas = new Set<string>();
    
    proyectos.forEach(proyecto => {
      const tieneAlerta = proyecto.evaluaciones.some(e => 
        e.criticidad === 'CRÍTICO' || e.criticidad === 'EN RIESGO'
      );
      if (tieneAlerta) {
        proyectosConAlertas.add(proyecto.id);
      }
    });

    stats.alertasActivas = proyectosConAlertas.size;

    set({ stats });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ani_dashboard_stats', JSON.stringify(stats));
        
        const proyectosCriticos = proyectos.filter(p => 
          p.criticidadGeneral === 'CRÍTICO' || p.criticidadGeneral === 'EN RIESGO'
        ).map(p => ({
          numero: p.numero,
          nombre: p.nombre,
          ubicacion: p.alcanceTerritorial,
          tipo: p.tipoProyecto,
          etapa: p.etapaActual,
          criticidad: p.criticidadGeneral,
          gits: p.evaluaciones
            .filter(e => e.criticidad === 'CRÍTICO' || e.criticidad === 'EN RIESGO')
            .map(e => e.git)
        }));
        localStorage.setItem('ani_dashboard_criticos', JSON.stringify(proyectosCriticos));
        
        localStorage.setItem('ani_dashboard_proyectos', JSON.stringify(proyectos));
        
        const distribucionTipo = {
          'Carretero': proyectos.filter(p => p.tipoProyecto === 'Carretero').length,
          'Férreo': proyectos.filter(p => p.tipoProyecto === 'Férreo').length,
          'Puerto/Fluvial': proyectos.filter(p => p.tipoProyecto === 'Puerto/Fluvial').length,
          'Aeropuerto': proyectos.filter(p => p.tipoProyecto === 'Aeropuerto').length,
        };
        localStorage.setItem('ani_dashboard_tipos', JSON.stringify(distribucionTipo));
        
        // Métricas avanzadas por GIT
        const gitMetrics: any = {};
        const gitsArray = ['Social', 'Predial', 'JPredial', 'Ambiental', 'Riesgos', 'Valorizacion'];

        gitsArray.forEach(git => {
          const proyectosConGit = proyectos.filter(p => 
            p.evaluaciones.some(e => e.git === git)
          );
          
          const criticos = proyectosConGit.filter(p => 
            p.evaluaciones.some(e => e.git === git && e.criticidad === 'CRÍTICO')
          ).length;
          
          const enRiesgo = proyectosConGit.filter(p => 
            p.evaluaciones.some(e => e.git === git && e.criticidad === 'EN RIESGO')
          ).length;
          
          const enObservacion = proyectosConGit.filter(p => 
            p.evaluaciones.some(e => e.git === git && e.criticidad === 'EN OBSERVACIÓN')
          ).length;
          
          const normal = proyectosConGit.filter(p => 
            p.evaluaciones.some(e => e.git === git && e.criticidad === 'NORMAL')
          ).length;
          
          const problemasGravesCount = criticos + enRiesgo;
          const porcentajeProblemas = proyectosConGit.length > 0 
            ? Math.round((problemasGravesCount / proyectosConGit.length) * 100) 
            : 0;
          
          gitMetrics[git] = {
            totalProyectos: proyectosConGit.length,
            critico: criticos,
            enRiesgo: enRiesgo,
            enObservacion: enObservacion,
            normal: normal,
            porcentajeProblemas: porcentajeProblemas,
            requiereAtencion: problemasGravesCount
          };
        });

        localStorage.setItem('ani_dashboard_git_metrics', JSON.stringify(gitMetrics));

        const metricsVPRE = {
          proyectosConMultiplesAlertas: proyectos.filter(p => {
            const alertas = p.evaluaciones.filter(e => 
              e.criticidad === 'CRÍTICO' || e.criticidad === 'EN RIESGO'
            ).length;
            return alertas >= 3;
          }).length,
          
          gitMasCritico: Object.keys(gitMetrics).length > 0 
            ? Object.keys(gitMetrics).reduce((prev, current) => 
                gitMetrics[current].requiereAtencion > gitMetrics[prev].requiereAtencion ? current : prev
              ) 
            : '-',
          
          gitMenosProblemas: Object.keys(gitMetrics).length > 0
            ? Object.keys(gitMetrics).reduce((prev, current) => 
                gitMetrics[current].porcentajeProblemas < gitMetrics[prev].porcentajeProblemas ? current : prev
              )
            : '-',
          
          proyectosPorEtapa: {
            'Estructuración': proyectos.filter(p => p.etapaActual === 'Estructuración').length,
            'Preconstrucción': proyectos.filter(p => p.etapaActual === 'Preconstrucción').length,
            'Construcción': proyectos.filter(p => p.etapaActual === 'Construcción').length,
            'Operación': proyectos.filter(p => p.etapaActual === 'Operación' || p.etapaActual === 'Operación-Reversión').length,
            'Reversión': proyectos.filter(p => p.etapaActual === 'Reversión').length,
          },
          
          proyectosMasComplejosCount: proyectos.filter(p => {
            const gitsProblematicos = p.evaluaciones.filter(e => 
              e.criticidad === 'CRÍTICO' || e.criticidad === 'EN RIESGO'
            ).length;
            return gitsProblematicos >= 4;
          }).length
        };

        localStorage.setItem('ani_dashboard_vpre_metrics', JSON.stringify(metricsVPRE));

        // Calcular completitud de información por GIT
        const gitCompletitud: any = {};
        gitsArray.forEach(git => {
          const evaluacionesGit = proyectos
            .map(p => p.evaluaciones.find(e => e.git === git))
            .filter(e => e !== undefined);
          
          const totalPosibles = proyectos.length;
          const evaluadas = evaluacionesGit.length;
          const conEstado = evaluacionesGit.filter(e => e && e.estado && e.estado.trim() !== '').length;
          
          const porcentajeEvaluadas = totalPosibles > 0 ? Math.round((evaluadas / totalPosibles) * 100) : 0;
          const porcentajeConEstado = evaluadas > 0 ? Math.round((conEstado / evaluadas) * 100) : 0;
          
          gitCompletitud[git] = {
            totalPosibles,
            evaluadas,
            conEstado,
            sinEvaluar: totalPosibles - evaluadas,
            porcentajeEvaluadas,
            porcentajeConEstado,
            porcentajeCompletitud: Math.round((conEstado / totalPosibles) * 100)
          };
        });

        localStorage.setItem('ani_dashboard_git_completitud', JSON.stringify(gitCompletitud));
        
        console.log('✅ Datos guardados en localStorage para dashboard VPRE');
      } catch (error) {
        console.error('Error guardando datos en localStorage:', error);
      }
    }
  },
}));