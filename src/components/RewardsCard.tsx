import React from 'react';
import { LucideIcon } from 'lucide-react';

interface RewardsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'emerald' | 'orange' | 'purple';
  subtitle: string;
}

const colorVariants = {
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
    text: 'text-emerald-600'
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-500',
    text: 'text-orange-600'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    text: 'text-purple-600'
  }
};

function RewardsCard({ title, value, icon: Icon, color, subtitle }: RewardsCardProps) {
  const colors = colorVariants[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export default RewardsCard;