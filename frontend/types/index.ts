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
  criticidadGeneral?: Criticidad;
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