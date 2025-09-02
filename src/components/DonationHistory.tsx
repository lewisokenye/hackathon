import React from 'react';
import { Calendar, Package, DollarSign, Clock } from 'lucide-react';

function DonationHistory() {
  const donations = [
    {
      id: 1,
      type: 'food',
      description: 'Fresh vegetables and fruits',
      foodType: 'vegetables',
      quantity: '5 kg',
      status: 'completed',
      createdAt: '2025-01-12',
      points: 10
    },
    {
      id: 2,
      type: 'money',
      amount: 50,
      description: 'Monthly donation for hunger relief',
      status: 'completed',
      createdAt: '2025-01-10',
      points: 10
    },
    {
      id: 3,
      type: 'food',
      description: 'Canned goods collection',
      foodType: 'canned',
      quantity: '12 cans',
      status: 'completed',
      createdAt: '2025-01-08',
      points: 10
    },
    {
      id: 4,
      type: 'money',
      amount: 25,
      description: 'Emergency relief contribution',
      status: 'processing',
      createdAt: '2025-01-05',
      points: 0
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Donation History</h2>

      <div className="space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  donation.type === 'food' ? 'bg-emerald-50' : 'bg-blue-50'
                }`}>
                  {donation.type === 'food' ? (
                    <Package className={`h-6 w-6 ${donation.type === 'food' ? 'text-emerald-600' : 'text-blue-600'}`} />
                  ) : (
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {donation.type === 'food' ? `${donation.foodType} donation` : `$${donation.amount} donation`}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{donation.description}</p>
                  {donation.type === 'food' && (
                    <p className="text-sm text-gray-500">Quantity: {donation.quantity}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                    </div>
                    {donation.points > 0 && (
                      <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                        +{donation.points} points
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  donation.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : donation.status === 'processing'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {donation.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {donations.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
          <p className="text-gray-600">Start making a difference by creating your first donation.</p>
        </div>
      )}
    </div>
  );
}

export default DonationHistory;