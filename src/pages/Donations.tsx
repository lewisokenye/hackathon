import React, { useState } from 'react';
import DonationForm from '../components/DonationForm';
import DonationHistory from '../components/DonationHistory';
import PaymentButton from '../components/PaymentButton';

function Donations() {
  const [activeTab, setActiveTab] = useState('donate');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Make a <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Donation</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your generosity helps fight hunger in our community. Every donation makes a difference.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('donate')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'donate'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-emerald-600'
            }`}
          >
            Make Donation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-emerald-600'
            }`}
          >
            Donation History
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'donate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DonationForm />
          <div className="space-y-6">
            <PaymentButton />
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Donation Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Fresh fruits and vegetables are always needed</li>
                <li>• Check expiration dates before donating</li>
                <li>• Monetary donations help us buy essentials</li>
                <li>• Every donation earns you reward points</li>
                <li>• Use our AI assistant for food safety guidance</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <DonationHistory />
      )}
    </div>
  );
}

export default Donations;