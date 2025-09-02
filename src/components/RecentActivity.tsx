import React from 'react';
import { Heart, Package, Star, Clock } from 'lucide-react';

function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'donation',
      title: 'Food donation made',
      description: 'Donated 5 canned goods to local food bank',
      time: '2 hours ago',
      icon: Heart,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 2,
      type: 'marketplace',
      title: 'Item claimed',
      description: 'Fresh vegetables claimed by Maria C.',
      time: '4 hours ago',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'reward',
      title: 'Badge earned',
      description: 'Achieved "Community Helper" badge',
      time: '1 day ago',
      icon: Star,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 4,
      type: 'donation',
      title: 'Monetary donation',
      description: '$25 donated to hunger relief fund',
      time: '2 days ago',
      icon: Heart,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center space-x-1 mt-2">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;