// lib/store.ts

import { create } from 'zustand';
import { Proyecto, FiltrosDashboard, DashboardStats, Criticidad, TipoGIT, EvaluacionGIT, VistaMode, StatsGIT, ProyectoSeguimiento, NotaProyecto, FiltroRapido } from '@/types';

// Mapeo de criticidad a puntos según metodología VPRE
const criticidadAPuntos = (criticidad: Criticidad): number => {
  const mapa: Record<Criticidad, number> = {
    'CRÍTICO': 4,
    'EN RIESGO': 3,
    'EN OBSERVACIÓN': 2,
    'NORMAL': 1
  };
  return mapa[criticidad] || 1;
};

// GITs que se usan en el cálculo (sin Valorización)
const GITS_CALCULO: TipoGIT[] = ['Social', 'JPredial', 'Predial', 'Ambiental', 'Riesgos'];

// Calcular criticidad general según metodología VPRE
const calcularCriticidadGeneral = (evaluaciones: EvaluacionGIT[]): { 
  criticidad: Criticidad; 
  puntaje: number 
} => {
  // Filtrar solo los GITs que se usan en el cálculo
  const evaluacionesRelevantes = evaluaciones.filter(e => 
    GITS_CALCULO.includes(e.git)
  );
  
  // Sumar puntos de los 5 GITs
  const puntajeTotal = evaluacionesRelevantes.reduce((suma, evaluacion) => {
    return suma + criticidadAPuntos(evaluacion.criticidad);
  }, 0);
  
  // Clasificar según rangos de la metodología VPRE
  let criticidad: Criticidad;
  if (puntajeTotal >= 17) {
    criticidad = 'CRÍTICO';
  } else if (puntajeTotal >= 13) {
    criticidad = 'EN RIESGO';
  } else if (puntajeTotal >= 9) {
    criticidad = 'EN OBSERVACIÓN';
  } else {
    criticidad = 'NORMAL';
  }
  
  return { criticidad, puntaje: puntajeTotal };
};

interface AppState {
  // Datos
  proyectos: Proyecto[];
  proyectosFiltrados: Proyecto[];
  stats: DashboardStats;
  vistaActual: VistaMode;
  statsGIT: StatsGIT[];
  
  // ✅ FASE 1: Seguimiento y Filtros
  seguimientos: ProyectoSeguimiento[];
  filtroRapido: FiltroRapido;
  
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
  setVistaActual: (vista: VistaMode) => void;
  calcularStatsGIT: () => void;
  
  // ✅ FASE 1: Funciones de seguimiento
  toggleSeguimiento: (proyectoId: string) => void;
  agregarNota: (proyectoId: string, nota: Omit<NotaProyecto, 'id' | 'proyectoId' | 'fecha'>) => void;
  obtenerNotasProyecto: (proyectoId: string) => NotaProyecto[];
  estaEnSeguimiento: (proyectoId: string) => boolean;
  setFiltroRapido: (filtro: FiltroRapido) => void;
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
  vistaActual: 'general',
  statsGIT: [],
  
  // ✅ FASE 1: Estados iniciales
  seguimientos: [],
  filtroRapido: 'todos',
  
  filtros: {},
  loading: false,
  selectedProyecto: null,

  // ✅ Inicializar seguimientos desde localStorage
  ...(typeof window !== 'undefined' && (() => {
    try {
      const seguimientosGuardados = localStorage.getItem('ani_seguimientos');
      return seguimientosGuardados ? { seguimientos: JSON.parse(seguimientosGuardados) } : {};
    } catch {
      return {};
    }
  })()),

  // Acciones
  setProyectos: (proyectos) => {
    // ✅ Calcular criticidad general y puntaje para cada proyecto según metodología VPRE
    const proyectosConCriticidad = proyectos.map(p => {
      const { criticidad, puntaje } = calcularCriticidadGeneral(p.evaluaciones);
      return {
        ...p,
        criticidadGeneral: criticidad,
        puntajeTotal: puntaje
      };
    });
    
    set({ 
      proyectos: proyectosConCriticidad,
      proyectosFiltrados: proyectosConCriticidad
    });
    get().calcularStats();
    get().calcularStatsGIT();
  },

  setFiltros: (filtros) => {
    set({ filtros });
    get().aplicarFiltros();
  },

  aplicarFiltros: () => {
    const { proyectos, filtros, filtroRapido } = get();
    let filtrados = [...proyectos];

    // ✅ Aplicar filtro rápido primero
    if (filtroRapido !== 'todos') {
      switch (filtroRapido) {
        case 'criticos':
          filtrados = filtrados.filter(p => p.criticidadGeneral === 'CRÍTICO');
          break;
        case 'enRiesgo':
          filtrados = filtrados.filter(p => p.criticidadGeneral === 'EN RIESGO');
          break;
        case 'enObservacion':
          filtrados = filtrados.filter(p => p.criticidadGeneral === 'EN OBSERVACIÓN');
          break;
        case 'normal':
          filtrados = filtrados.filter(p => p.criticidadGeneral === 'NORMAL');
          break;
      }
    }

    // Filtros existentes
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

    // ✅ CONTAR PROYECTOS POR SU CRITICIDAD GENERAL (Metodología VPRE)
    proyectos.forEach(proyecto => {
      switch (proyecto.criticidadGeneral) {
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

  setVistaActual: (vista) => {
    set({ vistaActual: vista });
    // Recalcular stats según la vista
    if (vista === 'git') {
      get().calcularStatsGIT();
    }
  },

  calcularStatsGIT: () => {
    const { proyectos } = get();
    
    const gitsArray: TipoGIT[] = ['Social', 'JPredial', 'Predial', 'Ambiental', 'Riesgos', 'Valorizacion'];
    
    const statsGIT: StatsGIT[] = gitsArray.map(git => {
      // Filtrar todas las evaluaciones de este GIT
      const evaluacionesGIT = proyectos
        .map(p => p.evaluaciones.find(e => e.git === git))
        .filter(e => e !== undefined) as EvaluacionGIT[];
      
      // Contar por criticidad
      const criticos = evaluacionesGIT.filter(e => e.criticidad === 'CRÍTICO').length;
      const enRiesgo = evaluacionesGIT.filter(e => e.criticidad === 'EN RIESGO').length;
      const enObservacion = evaluacionesGIT.filter(e => e.criticidad === 'EN OBSERVACIÓN').length;
      const normales = evaluacionesGIT.filter(e => e.criticidad === 'NORMAL').length;
      
      // Contar proyectos únicos afectados (con crítico o en riesgo en este GIT)
      const proyectosAfectados = proyectos.filter(p => 
        p.evaluaciones.some(e => 
          e.git === git && (e.criticidad === 'CRÍTICO' || e.criticidad === 'EN RIESGO')
        )
      ).length;
      
      return {
        git,
        totalEvaluaciones: evaluacionesGIT.length,
        criticos,
        enRiesgo,
        enObservacion,
        normales,
        proyectosAfectados
      };
    });
    
    set({ statsGIT });
  },

  // ✅ FASE 1: Funciones de seguimiento
  
  toggleSeguimiento: (proyectoId) => {
    const { seguimientos } = get();
    const index = seguimientos.findIndex(s => s.proyectoId === proyectoId);
    
    let nuevosSeguimientos: ProyectoSeguimiento[];
    
    if (index >= 0) {
      // Quitar de seguimiento
      nuevosSeguimientos = seguimientos.filter(s => s.proyectoId !== proyectoId);
    } else {
      // Agregar a seguimiento
      const nuevoSeguimiento: ProyectoSeguimiento = {
        proyectoId,
        enSeguimiento: true,
        fechaAgregado: new Date().toISOString(),
        notas: [],
        prioridad: 'media'
      };
      nuevosSeguimientos = [...seguimientos, nuevoSeguimiento];
    }
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ani_seguimientos', JSON.stringify(nuevosSeguimientos));
    }
    
    set({ seguimientos: nuevosSeguimientos });
  },

  agregarNota: (proyectoId, notaData) => {
    const { seguimientos } = get();
    
    const nota: NotaProyecto = {
      id: `nota-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      proyectoId,
      fecha: new Date().toISOString(),
      ...notaData
    };
    
    const nuevosSeguimientos = seguimientos.map(s => {
      if (s.proyectoId === proyectoId) {
        return {
          ...s,
          notas: [...s.notas, nota]
        };
      }
      return s;
    });
    
    // Si el proyecto no está en seguimiento, agregarlo
    if (!nuevosSeguimientos.find(s => s.proyectoId === proyectoId)) {
      nuevosSeguimientos.push({
        proyectoId,
        enSeguimiento: true,
        fechaAgregado: new Date().toISOString(),
        notas: [nota],
        prioridad: 'media'
      });
    }
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ani_seguimientos', JSON.stringify(nuevosSeguimientos));
    }
    
    set({ seguimientos: nuevosSeguimientos });
  },

  obtenerNotasProyecto: (proyectoId) => {
    const { seguimientos } = get();
    const seguimiento = seguimientos.find(s => s.proyectoId === proyectoId);
    return seguimiento?.notas || [];
  },

  estaEnSeguimiento: (proyectoId) => {
    const { seguimientos } = get();
    return seguimientos.some(s => s.proyectoId === proyectoId && s.enSeguimiento);
  },

  setFiltroRapido: (filtro) => {
    set({ filtroRapido: filtro });
    get().aplicarFiltros();
  },

}));