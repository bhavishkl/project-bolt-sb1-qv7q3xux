export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  micronutrients: {
    [key: string]: {
      amount: number;
      unit: string;
      dailyValue: number;
    }
  };
  costPerUnit: number;
  servingSize: number;
  servingUnit: string;
}

export interface FoodEntry {
  foodItemId: string;
  quantity: number;
  unit: string;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  micronutrients: {
    [key: string]: {
      amount: number;
      unit: string;
      percentDailyValue: number;
    }
  };
  cost: number;
  servings: number;
}