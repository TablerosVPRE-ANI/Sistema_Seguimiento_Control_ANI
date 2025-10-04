// components/ExcelUploader.tsx

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Proyecto, EvaluacionGIT, TipoProyecto, EtapaProyecto, Criticidad, TipoGIT } from '@/types';

interface ExcelUploaderProps {
  isOpen: boolean;
  onDataLoaded: (proyectos: Proyecto[]) => void;
  onClose: () => void;
}

export default function ExcelUploader({ isOpen, onDataLoaded, onClose }: ExcelUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const procesarExcel = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, {
        cellStyles: true,
        cellDates: true,
      });

      const todosProyectos: Proyecto[] = [];
      let proyectoId = 1;

      // Procesar cada hoja del Excel
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { 
          header: 1,
          defval: '',
          raw: false 
        });

        // Determinar tipo de proyecto según la hoja
        let tipoProyecto: TipoProyecto = 'Carretero';
        const sheetNameLower = sheetName.toLowerCase();

        // IMPORTANTE: Verificar aeropuertos PRIMERO antes que puertos
        if (sheetNameLower.includes('aeropuerto')) {
          tipoProyecto = 'Aeropuerto';
        } else if (sheetNameLower.includes('ferreo') || sheetNameLower.includes('férreo')) {
          tipoProyecto = 'Férreo';
        } else if (sheetNameLower.includes('puerto') || sheetNameLower.includes('fluvial')) {
          tipoProyecto = 'Puerto/Fluvial';
        } else if (sheetNameLower.includes('carretero')) {
          tipoProyecto = 'Carretero';
        }

        // La fila 4 (índice 4) contiene los headers de GIT
        // Los datos empiezan desde la fila 5 (índice 5)
        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Verificar si la fila tiene datos válidos
          if (!row[0] || !row[2]) continue; // Si no tiene número o nombre, skip
          
          const numero = parseInt(String(row[0]).trim()) || proyectoId;
          const nombre = String(row[2] || '').trim();
          
          if (!nombre || nombre === '') continue;

          // Mapear etapa
          let etapa: EtapaProyecto = 'Construcción';
          const etapaRaw = String(row[4] || '').toUpperCase();
          if (etapaRaw.includes('ESTRUCTURACIÓN')) etapa = 'Estructuración';
          else if (etapaRaw.includes('PRECONSTRUCCIÓN')) etapa = 'Preconstrucción';
          else if (etapaRaw.includes('CONSTRUCCIÓN')) etapa = 'Construcción';
          else if (etapaRaw.includes('OPERACIÓN') && etapaRaw.includes('REVERSIÓN')) etapa = 'Operación-Reversión';
          else if (etapaRaw.includes('OPERACIÓN')) etapa = 'Operación';
          else if (etapaRaw.includes('REVERSIÓN')) etapa = 'Reversión';

          // Extraer evaluaciones de cada GIT
          const evaluaciones: EvaluacionGIT[] = [];
          
          // Estructura de columnas (basado en tu Excel):
          // Col 5-6: Riesgos (estado, criticidad)
          // Col 7-8: JPredial (estado, criticidad)
          // Col 9-10: Predial (estado, criticidad)
          // Col 11-12: Social (estado, criticidad)
          // Col 13-14: Ambiental (estado, criticidad)
          // Col 15-16: Valorización (estado, criticidad)

          const gitsConfig = [
            { git: 'Riesgos', colEstado: 5, colCriticidad: 6 },
            { git: 'JPredial', colEstado: 7, colCriticidad: 8 },
            { git: 'Predial', colEstado: 9, colCriticidad: 10 },
            { git: 'Social', colEstado: 11, colCriticidad: 12 },
            { git: 'Ambiental', colEstado: 13, colCriticidad: 14 },
            { git: 'Valorizacion', colEstado: 15, colCriticidad: 16 },
          ];

          let criticidadGeneral: Criticidad | undefined = undefined;

          gitsConfig.forEach(({ git, colEstado, colCriticidad }) => {
            const criticidadRaw = String(row[colCriticidad] || '').trim().toUpperCase();
            let criticidad: Criticidad = 'NORMAL';

            if (criticidadRaw === 'CRÍTICO') criticidad = 'CRÍTICO';
            else if (criticidadRaw === 'EN RIESGO') criticidad = 'EN RIESGO';
            else if (criticidadRaw === 'EN OBSERVACIÓN') criticidad = 'EN OBSERVACIÓN';
            else if (criticidadRaw === 'NORMAL') criticidad = 'NORMAL';
            else if (criticidadRaw !== '') criticidad = 'NORMAL';
            else return; // Skip si no hay criticidad

            evaluaciones.push({
              git: git as TipoGIT,
              criticidad,
              estado: String(row[colEstado] || '').trim(),
              fechaEvaluacion: new Date().toISOString().split('T')[0],
            });

            // Determinar criticidad general (la más alta)
            if (!criticidadGeneral || 
                (criticidad === 'CRÍTICO') ||
                (criticidad === 'EN RIESGO' && criticidadGeneral !== 'CRÍTICO') ||
                (criticidad === 'EN OBSERVACIÓN' && criticidadGeneral === 'NORMAL')) {
              criticidadGeneral = criticidad;
            }
          });

          // Solo agregar el proyecto si tiene al menos una evaluación
          if (evaluaciones.length > 0) {
            todosProyectos.push({
              id: String(proyectoId),
              numero,
              nombre,
              tipoProyecto,
              alcanceTerritorial: String(row[1] || '').trim(),
              generacion: String(row[3] || '').trim(),
              etapaActual: etapa,
              criticidadGeneral,
              evaluaciones,
            });
            proyectoId++;
          }
        }
      });

      console.log(`✅ Procesados ${todosProyectos.length} proyectos del Excel`);
      
      if (todosProyectos.length === 0) {
        throw new Error('No se encontraron proyectos válidos en el archivo Excel');
      }

      setSuccess(`✅ Se cargaron exitosamente ${todosProyectos.length} proyectos`);
      onDataLoaded(todosProyectos);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error procesando Excel:', err);
      setError(`Error al procesar el archivo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarExcel(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <FileSpreadsheet className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Cargar Datos desde Excel</h2>
              <p className="text-sm text-gray-400 mt-1">
                Sube tu archivo Base_Datos_Proyectos_011025.xlsx
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

        {/* Upload Area */}
        <div className="mb-6">
          <label
            htmlFor="excel-upload"
            className={`block border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              loading
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-gray-600 hover:border-blue-400 hover:bg-white/5'
            }`}
          >
            <input
              id="excel-upload"
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
              Formatos soportados: .xlsx, .xls
            </p>
          </label>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <span className="text-blue-300 font-medium">
                Procesando datos del Excel...
              </span>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Error */}
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

        {/* Instrucciones */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-2">📋 Formato esperado del Excel:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Hojas: Carreteros, Ferreo, Puertos y Fluvial, Aeropuertos</li>
            <li>• Fila 5: Headers (NO., ALCANCE, PROYECTO, GENERACION, ETAPA, ...)</li>
            <li>• Columnas de GIT: Riesgos, JPredial, Predial, Social, Ambiental, Valorización</li>
            <li>• Cada GIT tiene 2 columnas: Estado y Criticidad</li>
          </ul>
        </div>
      </div>
    </div>
  );
}