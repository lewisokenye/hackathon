import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'orange' | 'purple';
}

const colorVariants = {
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
    text: 'text-emerald-600',
    change: 'text-emerald-600'
  },
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600',
    change: 'text-blue-600'
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-500',
    text: 'text-orange-600',
    change: 'text-orange-600'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    text: 'text-purple-600',
    change: 'text-purple-600'
  }
};

function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm font-medium ${colors.change} mt-1`}>
            {change} from last month
          </p>
        </div>
        <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;