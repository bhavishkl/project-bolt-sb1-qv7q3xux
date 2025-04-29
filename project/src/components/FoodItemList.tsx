import React from 'react';
import { Trash2 } from 'lucide-react';
import { FoodEntry } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { calculateItemNutrition, formatCurrency, formatNumber } from '../utils/nutritionCalculator';

interface FoodItemListProps {
  foodEntries: FoodEntry[];
  onRemoveFoodItem: (index: number) => void;
}

const FoodItemList: React.FC<FoodItemListProps> = ({ foodEntries, onRemoveFoodItem }) => {
  if (foodEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Food Items</h2>
        <div className="p-8 text-center text-gray-500">
          <p className="mb-2">No food items added yet</p>
          <p className="text-sm">Search and add food items to see their nutritional breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Food Items</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodEntries.map((entry, index) => {
              const food = foodDatabase.find(item => item.id === entry.foodItemId);
              const { nutrition, grams } = calculateItemNutrition(entry);
              
              if (!food) return null;
              
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{food.name}</div>
                    <div className="text-xs text-gray-500">{formatNumber(grams)}g total</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {entry.quantity} {entry.unit}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatNumber(nutrition.calories)} cal
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatNumber(nutrition.protein)}g
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatNumber(nutrition.carbs)}g
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatNumber(nutrition.fat)}g
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatCurrency(nutrition.cost)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => onRemoveFoodItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodItemList;