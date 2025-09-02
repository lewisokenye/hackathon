import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Food safety advice endpoint
router.post('/food-advice', async (req, res) => {
  try {
    const { foodType } = req.body;

    if (!foodType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Food type is required' 
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key is configured
      const mockAdvice = generateMockFoodAdvice(foodType);
      return res.json({ success: true, data: mockAdvice });
    }

    const prompt = `You are a food safety expert. Provide advice for donating "${foodType}". 
    Return ONLY a JSON object with this exact structure:
    {
      "safety_tips": ["tip1", "tip2", "tip3"],
      "recipe": "A simple recipe suggestion using this food type"
    }
    
    Keep safety tips practical and specific to food donation. Keep the recipe simple and accessible.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful food safety assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      res.json({ success: true, data: parsedResponse });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      const mockAdvice = generateMockFoodAdvice(foodType);
      res.json({ success: true, data: mockAdvice });
    }

  } catch (error) {
    console.error('Error getting AI food advice:', error);
    
    // Fallback to mock data
    const mockAdvice = generateMockFoodAdvice(foodType);
    res.json({ success: true, data: mockAdvice });
  }
});

// Recipe suggestions endpoint
router.post('/recipe-suggestions', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ingredients array is required' 
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      const mockRecipes = generateMockRecipes(ingredients);
      return res.json({ success: true, data: mockRecipes });
    }

    const prompt = `Create 3 simple recipe suggestions using these ingredients: ${ingredients.join(', ')}. 
    Return ONLY a JSON object with this structure:
    {
      "recipes": [
        {
          "name": "Recipe Name",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2", "step3"],
          "prep_time": "15 minutes"
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful cooking assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.4,
    });

    const aiResponse = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      res.json({ success: true, data: parsedResponse });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      const mockRecipes = generateMockRecipes(ingredients);
      res.json({ success: true, data: mockRecipes });
    }

  } catch (error) {
    console.error('Error getting recipe suggestions:', error);
    
    const mockRecipes = generateMockRecipes(ingredients);
    res.json({ success: true, data: mockRecipes });
  }
});

// Mock data generators for fallback
function generateMockFoodAdvice(foodType) {
  const adviceMap = {
    'fruits': {
      safety_tips: [
        'Wash all fruits thoroughly before donation',
        'Check for bruises or soft spots',
        'Donate within 2-3 days of purchase',
        'Keep refrigerated until pickup'
      ],
      recipe: 'Fresh Fruit Salad: Mix seasonal fruits, add a splash of lemon juice, and optionally drizzle with honey for a healthy community snack.'
    },
    'vegetables': {
      safety_tips: [
        'Remove any wilted or damaged parts',
        'Store in cool, dry place',
        'Separate root vegetables from leafy greens',
        'Label with harvest or purchase date'
      ],
      recipe: 'Community Vegetable Soup: Sauté onions, add mixed vegetables, vegetable broth, and season with herbs for a nourishing meal.'
    },
    'canned': {
      safety_tips: [
        'Check for dents, rust, or swelling',
        'Ensure labels are intact and readable',
        'Verify expiration dates are current',
        'Store in dry, cool environment'
      ],
      recipe: 'Hearty Bean Stew: Combine canned beans, diced tomatoes, and vegetables in a pot with spices for a protein-rich meal.'
    },
    'default': {
      safety_tips: [
        'Check expiration dates carefully',
        'Ensure proper storage temperature',
        'Handle with clean hands and utensils',
        'Pack securely for transport'
      ],
      recipe: 'Community Kitchen Special: Use fresh ingredients to create nutritious meals that bring people together.'
    }
  };

  return adviceMap[foodType.toLowerCase()] || adviceMap.default;
}

function generateMockRecipes(ingredients) {
  return {
    recipes: [
      {
        name: 'Community Bowl',
        ingredients: ingredients.slice(0, 4),
        instructions: [
          'Prepare all ingredients by washing and chopping',
          'Combine ingredients in a large bowl',
          'Season with salt, pepper, and available herbs',
          'Serve immediately or store refrigerated'
        ],
        prep_time: '15 minutes'
      },
      {
        name: 'Simple Stir-Fry',
        ingredients: ingredients.slice(0, 3),
        instructions: [
          'Heat oil in a large pan',
          'Add ingredients starting with hardest vegetables',
          'Stir frequently for 5-8 minutes',
          'Season and serve hot'
        ],
        prep_time: '20 minutes'
      }
    ]
  };
}

export default router;