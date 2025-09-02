import axios from 'axios';

const API_BASE_URL = '/api';

export const aiAPI = {
  async getFoodAdvice(foodType) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/food-advice`, { foodType });
      return response.data;
    } catch (error) {
      console.error('Error getting food advice:', error);
      throw error;
    }
  },

  async getRecipeSuggestions(ingredients) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/recipe-suggestions`, { ingredients });
      return response.data;
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      throw error;
    }
  }
};