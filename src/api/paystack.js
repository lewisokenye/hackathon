import axios from 'axios';

const API_BASE_URL = '/api';

export const paystackAPI = {
  async initializePayment(paymentData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/paystack/pay`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  },

  async verifyPayment(reference) {
    try {
      const response = await axios.get(`${API_BASE_URL}/paystack/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  async handleCallback(callbackData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/paystack/callback`, callbackData);
      return response.data;
    } catch (error) {
      console.error('Error handling payment callback:', error);
      throw error;
    }
  }
};