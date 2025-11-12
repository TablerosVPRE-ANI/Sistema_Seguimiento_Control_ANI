// components/HitosAccionesProgress.tsx

import React, { useState, useEffect } from 'react';
import { TipoGIT } from '@/types';

interface ItemSeguimiento {
  id: string;
  texto: string;
  completado: boolean;
}

interface HitosAccionesProgressProps {
  proyectoId: string;
  git: TipoGIT;
  texto: string;
  tipo: 'hitos' | 'acciones';
  icono: string;
  titulo: string;
}

export default function HitosAccionesProgress({
  proyectoId,
  git,
  texto,
  tipo,
  icono,
  titulo,
}: HitosAccionesProgressProps) {
  const [items, setItems] = useState<ItemSeguimiento[]>([]);

  // Parser de texto a items
  const parseTextToItems = (text: string): ItemSeguimiento[] => {
    if (!text || text.trim() === '') return [];

    // Detectar diferentes formatos de bullets
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsedItems: ItemSeguimiento[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Detectar bullets: *, •, -, números (1., 2., etc)
      const bulletRegex = /^[*•\-]\s+(.+)$/;
      const numberRegex = /^\d+\.\s+(.+)$/;
      
      let itemText = trimmed;
      
      if (bulletRegex.test(trimmed)) {
        itemText = trimmed.match(bulletRegex)![1];
      } else if (numberRegex.test(trimmed)) {
        itemText = trimmed.match(numberRegex)![1];
      }

      if (itemText) {
        parsedItems.push({
          id: `${proyectoId}-${git}-${tipo}-${index}`,
          texto: itemText,
          completado: false,
        });
      }
    });

    return parsedItems;
  };

  // Cargar estado desde localStorage
  useEffect(() => {
    const storageKey = `seguimiento-${proyectoId}-${git}-${tipo}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const parsed = parseTextToItems(texto);
      setItems(parsed);
    }
  }, [proyectoId, git, tipo, texto]);

  // Guardar en localStorage cuando cambie
  const toggleItem = (itemId: string) => {
    const updated = items.map(item =>
      item.id === itemId
        ? { ...item, completado: !item.completado }
        : item
    );
    setItems(updated);

    const storageKey = `seguimiento-${proyectoId}-${git}-${tipo}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Calcular progreso
  const totalItems = items.length;
  const completados = items.filter(item => item.completado).length;
  const porcentaje = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0;

  // Color según progreso
  const getProgressColor = () => {
    if (porcentaje >= 70) return 'bg-green-500';
    if (porcentaje >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = () => {
    if (porcentaje >= 70) return 'text-green-400';
    if (porcentaje >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (items.length === 0) {
    // Si no hay items parseables, mostrar texto original
    return (
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-gray-400 mt-0.5">{icono}</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
              {titulo}
            </p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {texto}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="flex items-start gap-2">
        <span className="text-sm font-medium text-gray-400 mt-0.5">{icono}</span>
        <div className="flex-1">
          {/* Header con título y progreso */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">
              {titulo}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${getProgressTextColor()}`}>
                {completados}/{totalItems}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className={`text-xs font-bold ${getProgressTextColor()}`}>
                {porcentaje}%
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div
              className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          {/* Lista de items con checkboxes */}
          <div className="space-y-2">
            {items.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-2 cursor-pointer group hover:bg-white/5 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.completado}
                  onChange={() => toggleItem(item.id)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                />
                <span
                  className={`text-sm leading-relaxed transition-all ${
                    item.completado
                      ? 'text-gray-500 line-through'
                      : 'text-gray-300 group-hover:text-white'
                  }`}
                >
                  {item.texto}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}