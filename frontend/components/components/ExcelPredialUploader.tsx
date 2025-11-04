'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ResumenPredial, SectorPredial } from '@/types';

interface ExcelPredialUploaderProps {
  isOpen: boolean;
  onDataLoaded: (resumenes: ResumenPredial[]) => void;
  onClose: () => void;
}

export default function ExcelPredialUploader({ isOpen, onDataLoaded, onClose }: ExcelPredialUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const calcularEstado = (porcentaje: number): 'Completado' | 'Avanzado' | 'En Progreso' | 'Crítico' => {
    if (porcentaje >= 100) return 'Completado';
    if (porcentaje >= 90) return 'Avanzado';
    if (porcentaje >= 50) return 'En Progreso';
    return 'Crítico';
  };

  const procesarExcelPredial = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, {
        cellStyles: true,
        cellDates: true,
      });

      const proyectosMap = new Map<string, {
        generacion: string;
        proyectoNombre: string;
        sectores: SectorPredial[];
        ultimaActualizacion: string;
        tecnicoACargo: string;
      }>();

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { 
          header: 1,
          defval: '',
          raw: false 
        });

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          if (!row || row.length < 5) continue;

          const generacion = String(row[0] || '').trim();
          const proyecto = String(row[1] || '').trim();
          const unidadFuncional = String(row[2] || '').trim();

          if (!generacion || !proyecto || !unidadFuncional) continue;
          if (unidadFuncional.toUpperCase().includes('SUBTOTAL')) continue;
          if (unidadFuncional.toUpperCase().includes('TOTAL')) continue;
          if (proyecto.toUpperCase().includes('SUBTOTAL')) continue;
          if (proyecto.toUpperCase().includes('TOTAL')) continue;

          const prediosRequeridos = parseInt(String(row[5] || '0')) || 0;
          const prediosConOfertaNotificada = parseInt(String(row[6] || '0')) || 0;
          const prediosDisponibles = parseInt(String(row[7] || '0')) || 0;
          const prediosDisponiblesPorcentaje = parseFloat(String(row[8] || '0')) || 0;
          const longitudEfectivaPredialDisponibleKm = parseFloat(String(row[9] || '0')) || 0;
          const longitudEfectivaPredialDisponiblePorcentaje = parseFloat(String(row[10] || '0')) || 0;
          const prediosAdquiridosEnajenacionVoluntaria = parseInt(String(row[11] || '0')) || 0;
          const prediosAdquiridosEnajenacionVoluntariaPorcentaje = parseFloat(String(row[12] || '0')) || 0;
          const prediosAdquiridosExpropiacionJudicial = parseInt(String(row[13] || '0')) || 0;
          const prediosAdquiridosExpropiacionJudicialPorcentaje = parseFloat(String(row[14] || '0')) || 0;
          const totalPrediosAdquiridos = parseInt(String(row[15] || '0')) || 0;
          const totalPrediosAdquiridosPorcentaje = parseFloat(String(row[16] || '0')) || 0;
          const prediosFaltantesPorAdquirir = parseInt(String(row[17] || '0')) || 0;
          const prediosFaltantesPorcentaje = parseFloat(String(row[18] || '0')) || 0;
          const observaciones = String(row[19] || '').trim();
          const ultimaActualizacion = String(row[20] || '').trim();
          const tecnicoACargo = String(row[21] || '').trim();

          if (prediosRequeridos === 0) continue;

          const sector: SectorPredial = {
            unidadFuncional,
            longitudProyectoKm: parseFloat(String(row[3] || '0')) || undefined,
            longitudEfectivaPredialTotalKm: parseFloat(String(row[4] || '0')) || undefined,
            prediosRequeridos,
            prediosConOfertaNotificada: prediosConOfertaNotificada > 0 ? prediosConOfertaNotificada : undefined,
            prediosDisponibles: prediosDisponibles > 0 ? prediosDisponibles : undefined,
            prediosDisponiblesPorcentaje: prediosDisponiblesPorcentaje > 0 ? prediosDisponiblesPorcentaje : undefined,
            longitudEfectivaPredialDisponibleKm: longitudEfectivaPredialDisponibleKm > 0 ? longitudEfectivaPredialDisponibleKm : undefined,
            longitudEfectivaPredialDisponiblePorcentaje: longitudEfectivaPredialDisponiblePorcentaje > 0 ? longitudEfectivaPredialDisponiblePorcentaje : undefined,
            prediosAdquiridosEnajenacionVoluntaria,
            prediosAdquiridosEnajenacionVoluntariaPorcentaje: prediosAdquiridosEnajenacionVoluntariaPorcentaje > 0 ? prediosAdquiridosEnajenacionVoluntariaPorcentaje : undefined,
            prediosAdquiridosExpropiacionJudicial,
            prediosAdquiridosExpropiacionJudicialPorcentaje: prediosAdquiridosExpropiacionJudicialPorcentaje > 0 ? prediosAdquiridosExpropiacionJudicialPorcentaje : undefined,
            totalPrediosAdquiridos,
            totalPrediosAdquiridosPorcentaje,
            prediosFaltantesPorAdquirir,
            prediosFaltantesPorcentaje,
            observaciones: observaciones || undefined,
            estadoSector: calcularEstado(totalPrediosAdquiridosPorcentaje)
          };

          if (!proyectosMap.has(proyecto)) {
            proyectosMap.set(proyecto, {
              generacion,
              proyectoNombre: proyecto,
              sectores: [],
              ultimaActualizacion: ultimaActualizacion || new Date().toLocaleDateString('es-CO'),
              tecnicoACargo: tecnicoACargo || 'No especificado'
            });
          }

          proyectosMap.get(proyecto)!.sectores.push(sector);
        }
      });

      const resumenes: ResumenPredial[] = [];

      proyectosMap.forEach((proyectoData) => {
        if (proyectoData.sectores.length === 0) return;

        const totalPrediosRequeridos = proyectoData.sectores.reduce((sum, s) => sum + s.prediosRequeridos, 0);
        const totalPrediosAdquiridos = proyectoData.sectores.reduce((sum, s) => sum + s.totalPrediosAdquiridos, 0);
        const totalPrediosFaltantes = proyectoData.sectores.reduce((sum, s) => sum + s.prediosFaltantesPorAdquirir, 0);
        
        const totalPrediosAdquiridosPorcentaje = totalPrediosRequeridos > 0 
          ? Math.round((totalPrediosAdquiridos / totalPrediosRequeridos) * 100 * 10) / 10
          : 0;
        
        const totalPrediosFaltantesPorcentaje = totalPrediosRequeridos > 0
          ? Math.round((totalPrediosFaltantes / totalPrediosRequeridos) * 100 * 10) / 10
          : 0;

        const totalLongitudEfectivaPredialKm = proyectoData.sectores.reduce((sum, s) => {
          return sum + (s.longitudEfectivaPredialTotalKm || 0);
        }, 0);

        const totalLongitudEfectivaPredialDisponibleKm = proyectoData.sectores.reduce((sum, s) => {
          return sum + (s.longitudEfectivaPredialDisponibleKm || 0);
        }, 0);

        const totalLongitudEfectivaPredialDisponiblePorcentaje = totalLongitudEfectivaPredialKm > 0
          ? Math.round((totalLongitudEfectivaPredialDisponibleKm / totalLongitudEfectivaPredialKm) * 100 * 10) / 10
          : 0;

        const resumen: ResumenPredial = {
          proyectoNombre: proyectoData.proyectoNombre,
          generacion: proyectoData.generacion,
          totalPrediosRequeridos,
          totalPrediosAdquiridos,
          totalPrediosAdquiridosPorcentaje,
          totalPrediosFaltantes,
          totalPrediosFaltantesPorcentaje,
          totalLongitudEfectivaPredialKm,
          totalLongitudEfectivaPredialDisponibleKm,
          totalLongitudEfectivaPredialDisponiblePorcentaje,
          ultimaActualizacion: proyectoData.ultimaActualizacion,
          tecnicoACargo: proyectoData.tecnicoACargo,
          sectores: proyectoData.sectores,
          estadoGeneral: calcularEstado(totalPrediosAdquiridosPorcentaje)
        };

        resumenes.push(resumen);
      });

      console.log(`✅ Procesados ${resumenes.length} proyectos con datos prediales`);
      console.log('Proyectos:', resumenes.map(r => r.proyectoNombre));

      if (resumenes.length === 0) {
        throw new Error('No se encontraron datos prediales válidos en el archivo Excel');
      }

      setSuccess(`✅ Se cargaron ${resumenes.length} proyectos con datos prediales`);
      onDataLoaded(resumenes);
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error procesando Excel Predial:', err);
      setError(`Error al procesar el archivo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarExcelPredial(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <FileSpreadsheet className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Cargar Datos Prediales</h2>
              <p className="text-sm text-gray-400 mt-1">
                Sube el archivo Excel con información predial
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="excel-predial-upload"
            className={`block border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              loading ? 'border-orange-400 bg-orange-500/10' : 'border-gray-600 hover:border-orange-400 hover:bg-white/5'
            }`}
          >
            <input
              id="excel-predial-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold text-white mb-2">
              {loading ? 'Procesando archivo...' : 'Click para seleccionar archivo'}
            </p>
            <p className="text-sm text-gray-400">
              Excel con datos de gestión predial
            </p>
          </label>
        </div>

        {loading && (
          <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
              <span className="text-orange-300 font-medium">Procesando datos prediales...</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div className="flex-1">
                <p className="text-red-300 font-medium">Error</p>
                <p className="text-sm text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-2">📋 Estructura esperada:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Columnas: GENERACIÓN, PROYECTO, UNIDAD FUNCIONAL, etc.</li>
            <li>• Datos de predios requeridos, adquiridos, faltantes</li>
            <li>• Observaciones y fechas de actualización</li>
            <li>• Se ignorarán filas SUBTOTAL y TOTAL automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}