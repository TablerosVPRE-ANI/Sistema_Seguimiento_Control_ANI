// components/CriticidadBadge.tsx

import React from 'react';
import { Criticidad } from '@/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface CriticidadBadgeProps {
  criticidad: Criticidad;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const criticidadConfig = {
  'CRÍTICO': {
    color: 'bg-red-500/20 text-red-300 border-red-400/50',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
  },
  'EN RIESGO': {
    color: 'bg-orange-500/20 text-orange-300 border-orange-400/50',
    icon: AlertCircle,
    iconColor: 'text-orange-400',
  },
  'EN OBSERVACIÓN': {
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    icon: Info,
    iconColor: 'text-yellow-400',
  },
  'NORMAL': {
    color: 'bg-green-500/20 text-green-300 border-green-400/50',
    icon: CheckCircle,
    iconColor: 'text-green-400',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function CriticidadBadge({
  criticidad,
  showIcon = true,
  size = 'md',
}: CriticidadBadgeProps) {
  const config = criticidadConfig[criticidad];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold border ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`${iconSizeClasses[size]} ${config.iconColor}`} />}
      {criticidad}
    </span>
  );
}