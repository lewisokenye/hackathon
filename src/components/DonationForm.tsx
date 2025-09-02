import React, { useState } from 'react';
import { Package, DollarSign, Send } from 'lucide-react';
import { donationsAPI } from '../api/donations';
import { useUser } from '../context/UserContext';
import FoodSafetyAssistant from './FoodSafetyAssistant';

function DonationForm() {
  const [formData, setFormData] = useState({
    type: 'food',
    description: '',
    amount: '',
    foodType: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, updateUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const donationData = {
        ...formData,
        donor_id: user?.id || '1',
        food_type: formData.foodType,
      };
      
      await donationsAPI.create(donationData);
      
      // Update user points (10 points per donation)
      if (user) {
        updateUser({ points: user.points + 10 });
      }

      setShowSuccess(true);
      setFormData({
        type: 'food',
        description: '',
        amount: '',
        foodType: '',
        quantity: ''
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Donation</h2>

        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 font-medium">✅ Donation created successfully! +10 points earned.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'food' })}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === 'food'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                }`}
              >
                <Package className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm font-medium">Food Items</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'money' })}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === 'money'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                }`}
              >
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm font-medium">Money</span>
              </button>
            </div>
          </div>

          {/* Conditional Fields */}
          {formData.type === 'food' ? (
            <>
              <div>
                <label htmlFor="foodType" className="block text-sm font-medium text-gray-700 mb-2">
                  Food Type
                </label>
                <select
                  id="foodType"
                  value={formData.foodType}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                >
                  <option value="">Select food type</option>
                  <option value="fruits">Fresh Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains & Cereals</option>
                  <option value="protein">Protein (Meat/Fish)</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="canned">Canned Goods</option>
                  <option value="snacks">Snacks & Treats</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 10 cans, 5 kg, 2 bags"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="25.00"
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us more about your donation..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit Donation</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Food Safety Assistant */}
      {formData.type === 'food' && (
        <FoodSafetyAssistant foodType={formData.foodType} />
      )}
    </div>
  );
}

export default DonationForm;