import axios from 'axios';

const API_BASE_URL = '/api';

export const marketplaceAPI = {
  async getItems() {
    try {
      const response = await axios.get(`${API_BASE_URL}/marketplace`);
      return response.data;
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      throw error;
    }
  },

  async addItem(itemData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/marketplace`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error adding marketplace item:', error);
      throw error;
    }
  },

  async claimItem(itemId) {
    try {
      const response = await axios.put(`${API_BASE_URL}/marketplace/${itemId}/claim`);
      return response.data;
    } catch (error) {
      console.error('Error claiming item:', error);
      throw error;
    }
  },

  async updateStatus(itemId, status) {
    try {
      const response = await axios.put(`${API_BASE_URL}/marketplace/${itemId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating item status:', error);
      throw error;
    }
  }
};