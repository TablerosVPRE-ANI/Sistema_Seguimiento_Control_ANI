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

// ================================
// ✅ SEGUIMIENTO PREDIAL - MÚLTIPLES PROYECTOS
// ================================

/**
 * Representa un sector/tramo individual de un proyecto
 * Ejemplo: "SECTOR I TABLON - PUENTE TELLEZ"
 */
export interface SectorPredial {
  // Identificación
  unidadFuncional: string;
  
  // Longitudes
  longitudProyectoKm?: number;
  longitudEfectivaPredialTotalKm?: number;
  longitudEfectivaPredialDisponibleKm?: number;
  longitudEfectivaPredialDisponiblePorcentaje?: number;
  
  // Predios requeridos y disponibles
  prediosRequeridos: number;
  prediosConOfertaNotificada?: number;
  prediosDisponibles?: number;
  prediosDisponiblesPorcentaje?: number;
  
  // Adquisición por método
  prediosAdquiridosEnajenacionVoluntaria: number;
  prediosAdquiridosEnajenacionVoluntariaPorcentaje?: number;
  prediosAdquiridosExpropiacionJudicial: number;
  prediosAdquiridosExpropiacionJudicialPorcentaje?: number;
  
  // Totales del sector
  totalPrediosAdquiridos: number;
  totalPrediosAdquiridosPorcentaje: number;
  prediosFaltantesPorAdquirir: number;
  prediosFaltantesPorcentaje: number;
  
  // Observaciones y estado
  observaciones?: string;
  estadoSector: 'Completado' | 'Avanzado' | 'En Progreso' | 'Crítico';
}

/**
 * Resumen completo de gestión predial de UN proyecto
 * Incluye todos sus sectores y totales agregados (SUBTOTAL)
 */
export interface ResumenPredial {
  // Identificación (para empatar con proyecto existente)
  proyectoNombre: string;
  generacion: string;
  
  // Totales agregados del proyecto (suma de todos los sectores)
  totalPrediosRequeridos: number;
  totalPrediosAdquiridos: number;
  totalPrediosAdquiridosPorcentaje: number;
  totalPrediosFaltantes: number;
  totalPrediosFaltantesPorcentaje: number;

    // ✅ NUEVOS CAMPOS PARA LONGITUDES
  totalLongitudEfectivaPredialKm: number;
  totalLongitudEfectivaPredialDisponibleKm: number;
  totalLongitudEfectivaPredialDisponiblePorcentaje: number;
  
  // Metadata
  ultimaActualizacion: string;
  tecnicoACargo: string;
  
  // Array con todos los sectores del proyecto
  sectores: SectorPredial[];
  
  // Estado general calculadoPredial
  estadoGeneral: 'Completado' | 'Avanzado' | 'En Progreso' | 'Crítico';
}

/**
 * Extiende el Proyecto existente para incluir datos prediales
 * Todos los proyectos usarán esta interface
 */
export interface ProyectoConPredial extends Proyecto {
  resumenPredial?: ResumenPredial;
  tieneDatosPrediales: boolean;
}
