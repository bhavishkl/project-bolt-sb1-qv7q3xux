import { FoodItem } from '../types';

// Vegetarian high protein food items available in India
export const foodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Green Gram (Mung Beans)',
    calories: 347,
    protein: 24,
    carbs: 63,
    fat: 1.2,
    fiber: 16,
    sugar: 6,
    micronutrients: {
      sodium: { amount: 15, unit: 'mg', dailyValue: 1 },
      potassium: { amount: 800, unit: 'mg', dailyValue: 23 },
      calcium: { amount: 132, unit: 'mg', dailyValue: 13 },
      iron: { amount: 7.6, unit: 'mg', dailyValue: 42 },
      magnesium: { amount: 130, unit: 'mg', dailyValue: 33 },
      zinc: { amount: 2.1, unit: 'mg', dailyValue: 19 },
      folate: { amount: 159, unit: 'mcg', dailyValue: 40 },
      phosphorus: { amount: 367, unit: 'mg', dailyValue: 29 },
      thiamine: { amount: 0.62, unit: 'mg', dailyValue: 52 },
      riboflavin: { amount: 0.23, unit: 'mg', dailyValue: 18 },
      niacin: { amount: 2.3, unit: 'mg', dailyValue: 14 },
      vitaminB6: { amount: 0.38, unit: 'mg', dailyValue: 22 },
      vitaminC: { amount: 4.8, unit: 'mg', dailyValue: 5 },
      vitaminE: { amount: 0.5, unit: 'mg', dailyValue: 3 },
      vitaminK: { amount: 9, unit: 'mcg', dailyValue: 8 }
    },
    costPerUnit: 0.16, // ₹0.02 per gram
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: '2',
    name: 'Nakpro Skimmed Milk Powder',
    calories: 350,
    protein: 36,
    carbs: 52,
    fat: 1,
    fiber: 0,
    sugar: 52,
    micronutrients: {
      calcium: { amount: 1250, unit: 'mg', dailyValue: 125 },
      vitaminD: { amount: 3, unit: 'IU', dailyValue: 0 },
      vitaminA: { amount: 100, unit: 'IU', dailyValue: 2 },
      phosphorus: { amount: 950, unit: 'mg', dailyValue: 76 },
      potassium: { amount: 1700, unit: 'mg', dailyValue: 48 },
      sodium: { amount: 500, unit: 'mg', dailyValue: 22 },
      riboflavin: { amount: 1.4, unit: 'mg', dailyValue: 108 },
      vitaminB12: { amount: 4.4, unit: 'mcg', dailyValue: 183 },
      magnesium: { amount: 100, unit: 'mg', dailyValue: 25 },
      zinc: { amount: 1.2, unit: 'mg', dailyValue: 11 }
    },
    costPerUnit: 0.45, // ₹0.15 per gram
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: '3',
    name: 'Fortune Soya Chunks',
    calories: 345,
    protein: 52,
    carbs: 33,
    fat: 0.7,
    fiber: 13,
    sugar: 1,
    micronutrients: {
      iron: { amount: 8, unit: 'mg', dailyValue: 44 },
      calcium: { amount: 200, unit: 'mg', dailyValue: 15 },
      magnesium: { amount: 200, unit: 'mg', dailyValue: 50 },
      phosphorus: { amount: 490, unit: 'mg', dailyValue: 39 },
      potassium: { amount: 1800, unit: 'mg', dailyValue: 51 },
      zinc: { amount: 3.3, unit: 'mg', dailyValue: 30 },
      folate: { amount: 280, unit: 'mcg', dailyValue: 70 },
      thiamine: { amount: 0.8, unit: 'mg', dailyValue: 67 },
      riboflavin: { amount: 0.3, unit: 'mg', dailyValue: 23 },
      niacin: { amount: 2.1, unit: 'mg', dailyValue: 13 },
      vitaminK: { amount: 47, unit: 'mcg', dailyValue: 39 }
    },
    costPerUnit: 0.125, // ₹0.10 per gram
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: '4',
    name: 'Paneer',
    calories: 265,
    protein: 18,
    carbs: 1.2,
    fat: 20,
    fiber: 0,
    sugar: 0,
    micronutrients: {
      calcium: { amount: 480, unit: 'mg', dailyValue: 48 },
      phosphorus: { amount: 250, unit: 'mg', dailyValue: 25 },
      vitaminB12: { amount: 1.2, unit: 'mcg', dailyValue: 20 },
      vitaminA: { amount: 210, unit: 'IU', dailyValue: 4 },
      vitaminD: { amount: 7, unit: 'IU', dailyValue: 2 },
      riboflavin: { amount: 0.15, unit: 'mg', dailyValue: 12 },
      zinc: { amount: 2.0, unit: 'mg', dailyValue: 18 },
      selenium: { amount: 14.5, unit: 'mcg', dailyValue: 26 },
      magnesium: { amount: 12, unit: 'mg', dailyValue: 3 }
    },
    costPerUnit: 0.20, // ₹0.20 per gram (approx. ₹20 per 100g)
    servingSize: 100,
    servingUnit: 'g',
  }
];
