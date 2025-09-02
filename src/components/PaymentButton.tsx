import React, { useState } from 'react';
import { CreditCard, Shield, Zap, ExternalLink } from 'lucide-react';
import { paystackAPI } from '../api/paystack';
import { useUser } from '../context/UserContext';

function PaymentButton() {
  const [amount, setAmount] = useState('25');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) < 1) return;

    setIsProcessing(true);
    try {
      const paymentData = {
        amount: parseFloat(amount),
        email: user?.email || 'donor@example.com',
        reference: `donation_${Date.now()}`,
        donor_id: user?.id || '1',
        description: `Monetary donation of $${amount}`
      };

      const response = await paystackAPI.initializePayment(paymentData);
      
      if (response.success) {
        // In a real app, this would redirect to Paystack
        if (response.data.authorization_url && response.data.authorization_url !== '#mock-payment-url') {
          window.open(response.data.authorization_url, '_blank');
        } else {
          // Mock payment success for demo
          alert(`Payment of $${amount} initialized successfully!\n\n${response.message}`);
          
          // Simulate successful payment verification
          setTimeout(async () => {
            try {
              await paystackAPI.verifyPayment(paymentData.reference);
              // Update user points for successful payment
              if (user) {
                const pointsToAdd = 10 + Math.floor(parseFloat(amount));
                const newPoints = user.points + pointsToAdd;
                // Update context (in real app, this would be fetched from backend)
                alert(`Payment verified! +${pointsToAdd} points earned (${user.points} → ${newPoints})`);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
            }
          }, 2000);
        }
      } else {
        alert('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please check your details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Quick Monetary Donation</h3>
      </div>

      <div className="space-y-4">
        {/* Preset Amounts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
          <div className="grid grid-cols-3 gap-2">
            {['10', '25', '50'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                  amount === preset
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-600'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="customAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-gray-900">Secure Payment</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 256-bit SSL encryption</li>
            <li>• PCI DSS compliant</li>
            <li>• Powered by Paystack</li>
            <li>• Instant reward points</li>
          </ul>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing || !amount || parseFloat(amount) < 1}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Donate ${amount}</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Points earned: {10 + Math.floor(parseFloat(amount) || 0)} pts (10 base + $1 = 1 pt)
        </p>
      </div>
    </div>
  );
}

export default PaymentButton;