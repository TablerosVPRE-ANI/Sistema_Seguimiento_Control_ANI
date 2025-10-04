// components/Filtros.tsx

import React, { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import { FiltrosDashboard, TipoProyecto, Criticidad, TipoGIT, EtapaProyecto } from '@/types';

interface FiltrosProps {
  filtros: FiltrosDashboard;
  onFiltrosChange: (filtros: FiltrosDashboard) => void;
}

export default function Filtros({ filtros, onFiltrosChange }: FiltrosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const tiposProyecto: TipoProyecto[] = ['Carretero', 'Férreo', 'Puerto/Fluvial', 'Aeropuerto'];
  const criticidades: Criticidad[] = ['CRÍTICO', 'EN RIESGO', 'EN OBSERVACIÓN', 'NORMAL'];
  const gits: TipoGIT[] = ['Social', 'Predial', 'JPredial', 'Ambiental', 'Riesgos', 'Valorizacion'];
  const etapas: EtapaProyecto[] = ['Estructuración', 'Preconstrucción', 'Construcción', 'Operación', 'Reversión'];

  const handleToggleTipoProyecto = (tipo: TipoProyecto) => {
    const tipos = filtros.tipoProyecto || [];
    const newTipos = tipos.includes(tipo)
      ? tipos.filter(t => t !== tipo)
      : [...tipos, tipo];
    onFiltrosChange({ ...filtros, tipoProyecto: newTipos });
  };

  const handleToggleCriticidad = (criticidad: Criticidad) => {
    const crits = filtros.criticidad || [];
    const newCrits = crits.includes(criticidad)
      ? crits.filter(c => c !== criticidad)
      : [...crits, criticidad];
    onFiltrosChange({ ...filtros, criticidad: newCrits });
  };

  const handleToggleGIT = (git: TipoGIT) => {
    const gitsActuales = filtros.git || [];
    const newGits = gitsActuales.includes(git)
      ? gitsActuales.filter(g => g !== git)
      : [...gitsActuales, git];
    onFiltrosChange({ ...filtros, git: newGits });
  };

  const handleToggleEtapa = (etapa: EtapaProyecto) => {
    const etapasActuales = filtros.etapa || [];
    const newEtapas = etapasActuales.includes(etapa)
      ? etapasActuales.filter(e => e !== etapa)
      : [...etapasActuales, etapa];
    onFiltrosChange({ ...filtros, etapa: newEtapas });
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({ ...filtros, busqueda: e.target.value });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.tipoProyecto && filtros.tipoProyecto.length > 0) count += filtros.tipoProyecto.length;
    if (filtros.criticidad && filtros.criticidad.length > 0) count += filtros.criticidad.length;
    if (filtros.git && filtros.git.length > 0) count += filtros.git.length;
    if (filtros.etapa && filtros.etapa.length > 0) count += filtros.etapa.length;
    if (filtros.busqueda && filtros.busqueda.trim() !== '') count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y botón de filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={filtros.busqueda || ''}
            onChange={handleBusquedaChange}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Filtros
          {filtrosActivos > 0 && (
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {filtrosActivos}
            </span>
          )}
        </button>
        {filtrosActivos > 0 && (
          <button
            onClick={limpiarFiltros}
            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {mostrarFiltros && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 space-y-6">
          {/* Filtro por Tipo de Proyecto */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Tipo de Proyecto</h3>
            <div className="flex flex-wrap gap-2">
              {tiposProyecto.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => handleToggleTipoProyecto(tipo)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filtros.tipoProyecto?.includes(tipo)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Criticidad */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Criticidad</h3>
            <div className="flex flex-wrap gap-2">
              {criticidades.map((crit) => {
                const colors = {
                  'CRÍTICO': 'bg-red-500 hover:bg-red-600',
                  'EN RIESGO': 'bg-orange-500 hover:bg-orange-600',
                  'EN OBSERVACIÓN': 'bg-yellow-500 hover:bg-yellow-600',
                  'NORMAL': 'bg-green-500 hover:bg-green-600',
                };
                return (
                  <button
                    key={crit}
                    onClick={() => handleToggleCriticidad(crit)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                      filtros.criticidad?.includes(crit)
                        ? colors[crit]
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {crit}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtro por GIT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">GIT (Grupo Interno de Trabajo)</h3>
            <div className="flex flex-wrap gap-2">
              {gits.map((git) => (
                <button
                  key={git}
                  onClick={() => handleToggleGIT(git)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filtros.git?.includes(git)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {git}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Etapa */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Etapa del Proyecto</h3>
            <div className="flex flex-wrap gap-2">
              {etapas.map((etapa) => (
                <button
                  key={etapa}
                  onClick={() => handleToggleEtapa(etapa)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filtros.etapa?.includes(etapa)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {etapa}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}