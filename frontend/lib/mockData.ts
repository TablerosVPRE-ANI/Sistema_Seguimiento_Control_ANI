// lib/mockData.ts

import { Proyecto } from '@/types';

export const mockProyectos: Proyecto[] = [
  {
    id: '1',
    numero: 1,
    nombre: 'Accesos Cali Palmira - Nueva Malla Vial del Valle del Cauca',
    tipoProyecto: 'Carretero',
    alcanceTerritorial: 'Andina Central',
    generacion: '5G (1era ola)',
    etapaActual: 'Construcción',
    criticidadGeneral: 'EN RIESGO',
    avanceFisico: 65.5,
    avanceFinanciero: 58.2,
    evaluaciones: [
      {
        git: 'Riesgos',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'En tramite suscripción de resolucion de tarifas especiales.',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'JPredial',
        criticidad: 'NORMAL',
        estado: 'La gestión predial avanza con normalidad',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Predial',
        criticidad: 'NORMAL',
        estado: 'Disponibilidad predial del 99% para todo el proyecto (325,39 km)',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Social',
        criticidad: 'NORMAL',
        estado: 'Se han definido tarifas diferenciales en coordinación con las autoridades locales',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Ambiental',
        criticidad: 'EN RIESGO',
        estado: 'ANI debe recibir la Licencia Ambiental de la variante El Bolo',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Valorizacion',
        criticidad: 'NORMAL',
        estado: 'Sin novedades',
        fechaEvaluacion: '2025-10-01'
      }
    ]
  },
  {
    id: '2',
    numero: 2,
    nombre: 'Accesos Norte II',
    tipoProyecto: 'Carretero',
    alcanceTerritorial: 'Andina Central',
    generacion: '5G (1era ola)',
    etapaActual: 'Operación',
    criticidadGeneral: 'CRÍTICO',
    avanceFisico: 95.0,
    avanceFinanciero: 92.5,
    evaluaciones: [
      {
        git: 'Riesgos',
        criticidad: 'EN RIESGO',
        estado: 'Es necessario definir en el instrumento contractual para la distribución de los recursos',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'JPredial',
        criticidad: 'EN RIESGO',
        estado: 'En trámite licencia ambiental y pendiente cumplimiento por parte del Distrito',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Predial',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'Disponibilidad predial por encima del 40% en las UF 1, 2, 4 y 5',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Social',
        criticidad: 'NORMAL',
        estado: 'Mesa de diálogo permanente enfocada en la revisión de tarifas diferenciales',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Ambiental',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'Se adelantan dos trámites de licenciamiento ambiental ante la ANLA',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Valorizacion',
        criticidad: 'EN RIESGO',
        estado: 'Socialización, manejo de información al contribuyente potencial',
        fechaEvaluacion: '2025-10-01'
      }
    ]
  },
  {
    id: '3',
    numero: 3,
    nombre: 'Autopista al Mar 2',
    tipoProyecto: 'Carretero',
    alcanceTerritorial: 'Antioquia',
    generacion: '4G (1era ola)',
    etapaActual: 'Operación',
    criticidadGeneral: 'CRÍTICO',
    avanceFisico: 98.0,
    avanceFinanciero: 96.8,
    evaluaciones: [
      {
        git: 'Riesgos',
        criticidad: 'NORMAL',
        estado: 'Gestión normal de riesgos operativos',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'JPredial',
        criticidad: 'EN RIESGO',
        estado: 'Presunto incumplimiento del concesionario en las UF 2 y 4',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Predial',
        criticidad: 'EN RIESGO',
        estado: 'Se está revisando otrosí del 4,17, revisión de retenciones',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Social',
        criticidad: 'NORMAL',
        estado: 'Relacionamiento comunitario estable',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Ambiental',
        criticidad: 'NORMAL',
        estado: 'Cumplimiento de obligaciones ambientales',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Valorizacion',
        criticidad: 'CRÍTICO',
        estado: 'Inminente socialización, y manejo de medios, tema tecnológico, censo predial',
        fechaEvaluacion: '2025-10-01'
      }
    ]
  },
  {
    id: '4',
    numero: 4,
    nombre: 'Proyecto Férreo Bogotá - Belencito',
    tipoProyecto: 'Férreo',
    alcanceTerritorial: 'Nacional',
    generacion: '5G',
    etapaActual: 'Estructuración',
    criticidadGeneral: 'EN OBSERVACIÓN',
    avanceFisico: 15.0,
    avanceFinanciero: 12.0,
    evaluaciones: [
      {
        git: 'Riesgos',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'Identificación y análisis de riesgos en fase temprana',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'JPredial',
        criticidad: 'NORMAL',
        estado: 'Inicio de gestión predial',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Predial',
        criticidad: 'NORMAL',
        estado: 'Censo predial en proceso',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Social',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'Socialización inicial con comunidades del área de influencia',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Ambiental',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'Estudios ambientales en desarrollo',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Valorizacion',
        criticidad: 'NORMAL',
        estado: 'Fase inicial de evaluación',
        fechaEvaluacion: '2025-10-01'
      }
    ]
  },
  {
    id: '5',
    numero: 5,
    nombre: 'Puerto de Buenaventura - Modernización',
    tipoProyecto: 'Puerto/Fluvial',
    alcanceTerritorial: 'Pacífico',
    generacion: '4G',
    etapaActual: 'Construcción',
    criticidadGeneral: 'EN RIESGO',
    avanceFisico: 45.0,
    avanceFinanciero: 42.0,
    evaluaciones: [
      {
        git: 'Riesgos',
        criticidad: 'EN RIESGO',
        estado: 'Retrasos por condiciones climáticas y logística',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'JPredial',
        criticidad: 'NORMAL',
        estado: 'Predios adquiridos según cronograma',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Predial',
        criticidad: 'NORMAL',
        estado: 'Disponibilidad del 85%',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Social',
        criticidad: 'EN OBSERVACIÓN',
        estado: 'Mesas de trabajo con comunidades afrodescendientes',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Ambiental',
        criticidad: 'CRÍTICO',
        estado: 'Compensaciones ambientales en mora, seguimiento ANLA',
        fechaEvaluacion: '2025-10-01'
      },
      {
        git: 'Valorizacion',
        criticidad: 'NORMAL',
        estado: 'No aplica',
        fechaEvaluacion: '2025-10-01'
      }
    ]
  }
];