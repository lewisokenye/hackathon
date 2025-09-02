import React from 'react';
import { MapPin, Calendar, User, Package, Check } from 'lucide-react';

interface MarketplaceCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    quantity: string;
    donor_name: string;
    status: 'available' | 'claimed';
    created_at: string;
    location: string;
    category: string;
  };
  onClaim: () => void;
}

function MarketplaceCard({ item, onClaim }: MarketplaceCardProps) {
  const categoryColors = {
    fruits: 'bg-red-100 text-red-700',
    vegetables: 'bg-green-100 text-green-700',
    grains: 'bg-yellow-100 text-yellow-700',
    protein: 'bg-pink-100 text-pink-700',
    dairy: 'bg-blue-100 text-blue-700',
    canned: 'bg-purple-100 text-purple-700'
  };

  const categoryColor = categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {item.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
              {item.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          item.status === 'available' ? 'bg-emerald-400' : 'bg-gray-400'
        }`}></div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>Quantity: {item.quantity}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Donated by: {item.donor_name}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {item.status === 'available' ? (
        <button
          onClick={onClaim}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Package className="h-4 w-4" />
          <span>Claim Item</span>
        </button>
      ) : (
        <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
          <Check className="h-4 w-4" />
          <span>Already Claimed</span>
        </div>
      )}
    </div>
  );
}

export default MarketplaceCard;