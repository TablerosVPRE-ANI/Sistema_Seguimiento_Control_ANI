// types/index.ts

export type TipoProyecto = 'Carretero' | 'Férreo' | 'Puerto/Fluvial' | 'Aeropuerto';

export type EtapaProyecto = 
  | 'Estructuración' 
  | 'Preconstrucción' 
  | 'Construcción' 
  | 'Operación' 
  | 'Reversión'
  | 'Operación-Reversión';

export type Criticidad = 
  | 'CRÍTICO' 
  | 'EN RIESGO' 
  | 'EN OBSERVACIÓN' 
  | 'NORMAL';

export type TipoGIT = 
  | 'Social' 
  | 'Predial' 
  | 'JPredial' 
  | 'Ambiental' 
  | 'Riesgos' 
  | 'Valorizacion';

export interface EvaluacionGIT {
  git: TipoGIT;
  criticidad: Criticidad;
  estado: string;
  observaciones?: string;
  fechaEvaluacion: string;
}

export interface Proyecto {
  id: string;
  numero: number;
  nombre: string;
  tipoProyecto: TipoProyecto;
  alcanceTerritorial: string;
  generacion: string;
  etapaActual: EtapaProyecto;
  criticidadGeneral ?: Criticidad;
  puntajeTotal: number;
  evaluaciones: EvaluacionGIT[];
  
  // Métricas opcionales
  avanceFisico?: number;
  avanceFinanciero?: number;
  presupuesto?: number;
  
  // Metadatos
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface DashboardStats {
  totalProyectos: number;
  criticos: number;
  enRiesgo: number;
  enObservacion: number;
  normales: number;
  alertasActivas: number;
  recomendacionesIA: number;
}

export interface FiltrosDashboard {
  tipoProyecto?: TipoProyecto[];
  criticidad?: Criticidad[];
  git?: TipoGIT[];
  etapa?: EtapaProyecto[];
  busqueda?: string;
}
// Tipo para modo de vista del dashboard
export type VistaMode = 'general' | 'git' | 'seguimiento';

// Estadísticas individuales por GIT
export interface StatsGIT {
  git: TipoGIT;
  totalEvaluaciones: number;
  criticos: number;
  enRiesgo: number;
  enObservacion: number;
  normales: number;
  proyectosAfectados: number;
}
// ✅ FASE 1: Sistema de Seguimiento y Notas

export interface NotaProyecto {
  id: string;
  proyectoId: string;
  texto: string;
  fecha: string;
  autor?: string;
  tipo: 'seguimiento' | 'accion' | 'observacion' | 'reunion';
}

export interface ProyectoSeguimiento {
  proyectoId: string;
  enSeguimiento: boolean;
  fechaAgregado: string;
  notas: NotaProyecto[];
  prioridad?: 'alta' | 'media' | 'baja';
}

export type FiltroRapido = 'todos' | 'criticos' | 'enRiesgo' | 'enObservacion' | 'normal';