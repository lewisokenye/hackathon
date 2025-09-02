import axios from 'axios';

const API_BASE_URL = '/api';

export const rewardsAPI = {
  async getUserRewards(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/rewards/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user rewards:', error);
      throw error;
    }
  },

  async updatePoints(userId, points) {
    try {
      const response = await axios.put(`${API_BASE_URL}/rewards/${userId}/points`, { points });
      return response.data;
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    }
  },

  async updateStreak(userId, streak) {
    try {
      const response = await axios.put(`${API_BASE_URL}/rewards/${userId}/streak`, { streak });
      return response.data;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  async awardBadge(userId, badge) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rewards/${userId}/badges`, { badge });
      return response.data;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }
};