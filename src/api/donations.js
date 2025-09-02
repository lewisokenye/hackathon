import axios from 'axios';

const API_BASE_URL = '/api';

export const donationsAPI = {
  async getAll() {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  async create(donationData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations`, donationData);
      return response.data;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  async getByUser(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user donations:', error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/donations/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw error;
    }
  }
};