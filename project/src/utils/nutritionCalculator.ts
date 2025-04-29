import { FoodEntry, FoodItem, NutritionTotals } from '../types';
import { foodDatabase } from '../data/foodDatabase';

// Convert standard measurements to grams for a food item
export function convertToGrams(quantity: number, unit: string, foodItem: FoodItem): number {
  if (unit === 'g') return quantity;
  if (unit === foodItem.servingUnit) return quantity * foodItem.servingSize;
  
  // Handle common conversions
  switch (unit) {
    case 'oz':
      return quantity * 28.35;
    case 'lb':
      return quantity * 453.59;
    case 'cup':
      // Cup conversions vary by food type
      if (foodItem.name.includes('Rice') || foodItem.name.includes('Quinoa')) {
        return quantity * 180;
      } else if (foodItem.name.includes('Oil')) {
        return quantity * 224;
      } else {
        return quantity * 128; // General cup to gram conversion
      }
    case 'tbsp':
      return quantity * 15;
    case 'tsp':
      return quantity * 5;
    case 'piece':
    case 'serving':
      return quantity * foodItem.servingSize;
    default:
      return quantity;
  }
}

// Calculate nutrition for a single food item entry
export function calculateItemNutrition(entry: FoodEntry): {
  foodItem: FoodItem;
  grams: number;
  nutrition: NutritionTotals;
} {
  const foodItem = foodDatabase.find(item => item.id === entry.foodItemId);
  
  if (!foodItem) {
    throw new Error(`Food item with ID ${entry.foodItemId} not found`);
  }
  
  const grams = convertToGrams(entry.quantity, entry.unit, foodItem);
  
  // For supplements with non-gram serving units (like tablets), use a different calculation
  let ratio: number;
  if (foodItem.servingUnit !== 'g') {
    // For supplements, calculate based on number of servings rather than grams
    ratio = entry.quantity / 1; // 1 serving = 1 tablet/pill/etc.
  } else {
    // For regular food items, calculate based on grams
    ratio = grams / 100; // Most nutrition data is per 100g
  }
  
  const micronutrients: {[key: string]: {amount: number; unit: string; percentDailyValue: number}} = {};
  
  Object.entries(foodItem.micronutrients).forEach(([key, value]) => {
    micronutrients[key] = {
      amount: value.amount * ratio,
      unit: value.unit,
      percentDailyValue: value.dailyValue * ratio
    };
  });
  
  return {
    foodItem,
    grams,
    nutrition: {
      calories: foodItem.calories * ratio,
      protein: foodItem.protein * ratio,
      carbs: foodItem.carbs * ratio,
      fat: foodItem.fat * ratio,
      fiber: foodItem.fiber * ratio,
      sugar: foodItem.sugar * ratio,
      micronutrients,
      cost: foodItem.costPerUnit * entry.quantity, // Use quantity directly for supplements
      servings: entry.quantity // Use quantity directly for supplements
    }
  };
}

// Calculate nutrition totals for multiple food entries
export function calculateTotalNutrition(entries: FoodEntry[]): NutritionTotals {
  if (entries.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      micronutrients: {},
      cost: 0,
      servings: 0
    };
  }
  
  const totals: NutritionTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    micronutrients: {},
    cost: 0,
    servings: 0
  };
  
  const allMicronutrients = new Set<string>();
  
  // First pass: collect all micronutrient keys
  entries.forEach(entry => {
    const foodItem = foodDatabase.find(item => item.id === entry.foodItemId);
    if (foodItem) {
      Object.keys(foodItem.micronutrients).forEach(key => {
        allMicronutrients.add(key);
      });
    }
  });
  
  // Initialize all micronutrients in totals
  allMicronutrients.forEach(key => {
    totals.micronutrients[key] = {
      amount: 0,
      unit: '',
      percentDailyValue: 0
    };
  });
  
  // Second pass: calculate totals
  entries.forEach(entry => {
    const { nutrition } = calculateItemNutrition(entry);
    
    totals.calories += nutrition.calories;
    totals.protein += nutrition.protein;
    totals.carbs += nutrition.carbs;
    totals.fat += nutrition.fat;
    totals.fiber += nutrition.fiber;
    totals.sugar += nutrition.sugar;
    totals.cost += nutrition.cost;
    totals.servings += nutrition.servings;
    
    // Sum micronutrients
    Object.entries(nutrition.micronutrients).forEach(([key, value]) => {
      if (totals.micronutrients[key]) {
        totals.micronutrients[key].amount += value.amount;
        totals.micronutrients[key].percentDailyValue += value.percentDailyValue;
        totals.micronutrients[key].unit = value.unit; // Assume units are consistent
      }
    });
  });
  
  return totals;
}

// Generate dietary warnings based on nutrition totals
export function generateDietaryWarnings(totals: NutritionTotals): string[] {
  const warnings: string[] = [];
  
  // Sodium warnings
  if (totals.micronutrients.sodium && totals.micronutrients.sodium.percentDailyValue > 100) {
    warnings.push('High sodium: Exceeds 100% of daily recommended value.');
  }
  
  // Sugar warnings
  if (totals.sugar > 50) {
    warnings.push('High sugar: Contains more than 50g of sugar.');
  }
  
  // Fat warnings
  if (totals.fat > 65) {
    warnings.push('High fat: Exceeds recommended daily intake.');
  }
  
  // Protein considerations
  if (totals.protein < 50) {
    warnings.push('Low protein: Consider adding more protein sources.');
  }
  
  // Fiber considerations
  if (totals.fiber < 25) {
    warnings.push('Low fiber: Consider adding more fiber-rich foods.');
  }
  
  // Check for high calorie content
  if (totals.calories > 2000) {
    warnings.push('High calorie: Exceeds 2000 calories, which is the average daily intake for adults.');
  }
  
  // Vitamin and mineral deficiencies
  const essentialNutrients = [
    'vitamin A', 'vitamin C', 'vitamin D', 'vitamin E', 'vitamin B12',
    'iron', 'calcium', 'magnesium', 'zinc', 'potassium'
  ];
  
  essentialNutrients.forEach(nutrient => {
    if (totals.micronutrients[nutrient] && totals.micronutrients[nutrient].percentDailyValue < 20) {
      warnings.push(`Low ${nutrient}: Contains less than 20% of daily recommended value.`);
    }
  });
  
  return warnings;
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format number with specified precision
export function formatNumber(num: number, precision: number = 1): string {
  return num.toFixed(precision);
}