// components/StatCard.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'gray';
}

const colorClasses = {
  blue: 'bg-blue-500/20 border-blue-400/30 text-blue-300',
  red: 'bg-red-500/20 border-red-400/30 text-red-300',
  yellow: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300',
  green: 'bg-green-500/20 border-green-400/30 text-green-300',
  purple: 'bg-purple-500/20 border-purple-400/30 text-purple-300',
  gray: 'bg-gray-500/20 border-gray-400/30 text-gray-300',
};

const iconColorClasses = {
  blue: 'text-blue-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  gray: 'text-gray-400',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'blue',
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-6 border backdrop-blur-sm transition-all hover:scale-105 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-300 mb-2">{title}</p>
          <h3 className="text-4xl font-bold mb-2">{value}</h3>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-black/30 ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}