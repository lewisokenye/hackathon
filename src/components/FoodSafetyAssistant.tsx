import React, { useState } from 'react';
import { Brain, Lightbulb, ChefHat, Loader } from 'lucide-react';
import { aiAPI } from '../api/ai';

interface FoodSafetyAssistantProps {
  foodType?: string;
  className?: string;
}

function FoodSafetyAssistant({ foodType = '', className = '' }: FoodSafetyAssistantProps) {
  const [selectedFood, setSelectedFood] = useState(foodType);
  const [advice, setAdvice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const foodTypes = [
    'fruits', 'vegetables', 'grains', 'protein', 'dairy', 'canned', 'snacks'
  ];

  const getAdvice = async () => {
    if (!selectedFood) return;

    setIsLoading(true);
    try {
      const response = await aiAPI.getFoodAdvice(selectedFood);
      setAdvice(response.data);
    } catch (error) {
      console.error('Error getting food advice:', error);
      setAdvice({
        safety_tips: ['Unable to load safety tips at this time'],
        recipe: 'Recipe suggestions unavailable'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Food Safety Assistant</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Food Type
          </label>
          <select
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            <option value="">Choose food type...</option>
            {foodTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={getAdvice}
          disabled={!selectedFood || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Getting Advice...</span>
            </>
          ) : (
            <>
              <Lightbulb className="h-5 w-5" />
              <span>Get Safety Tips</span>
            </>
          )}
        </button>

        {advice && (
          <div className="space-y-4 mt-6">
            {/* Safety Tips */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <h4 className="font-semibold text-amber-800">Safety Tips</h4>
              </div>
              <ul className="space-y-2">
                {advice.safety_tips?.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-amber-700 flex items-start space-x-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recipe Suggestion */}
            {advice.recipe && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <ChefHat className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-800">Recipe Suggestion</h4>
                </div>
                <p className="text-sm text-green-700">{advice.recipe}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodSafetyAssistant;