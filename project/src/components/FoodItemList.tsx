import React, { useState } from 'react';
import { Trash2, Edit2, Utensils, Scale, Flame, Beef, Wheat, Droplet, IndianRupee, DollarSign, List } from 'lucide-react';
import { FoodEntry } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { calculateItemNutrition, formatCurrency, formatNumber } from '../utils/nutritionCalculator';
import FoodItemEdit from './FoodItemEdit';

interface FoodItemListProps {
  foodEntries: FoodEntry[];
  onRemoveFoodItem: (index: number) => void;
  onUpdateFoodItem: (index: number, updatedEntry: FoodEntry) => void;
}

const FoodItemList: React.FC<FoodItemListProps> = ({ 
  foodEntries, 
  onRemoveFoodItem,
  onUpdateFoodItem
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  if (foodEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <List className="mr-2" size={20} />
          Food Items
        </h2>
        <div className="p-8 text-center text-gray-500">
          <p className="mb-2">No food items added yet</p>
          <p className="text-sm">Search and add food items to see their nutritional breakdown</p>
        </div>
      </div>
    );
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };
  
  const handleSaveEdit = (index: number, updatedEntry: FoodEntry) => {
    onUpdateFoodItem(index, updatedEntry);
    setEditingIndex(null);
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <List className="mr-2" size={20} />
        Food Items
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Utensils className="mr-1" size={14} />
                  Food Item
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Scale className="mr-1" size={14} />
                  Quantity
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Flame className="mr-1" size={14} />
                  Calories
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Beef className="mr-1" size={14} />
                  Protein
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Wheat className="mr-1" size={14} />
                  Carbs
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Droplet className="mr-1" size={14} />
                  Fat
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <IndianRupee className="mr-1" size={14} />
                  Cost
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <DollarSign className="mr-1" size={14} />
                  Cost/Protein
                </div>
              </th>
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
                    {editingIndex === index ? (
                      <FoodItemEdit 
                        entry={entry}
                        onSave={(updatedEntry) => handleSaveEdit(index, updatedEntry)}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <div className="flex items-center">
                        <span>{entry.quantity} {entry.unit}</span>
                        <button
                          onClick={() => handleEdit(index)}
                          className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit quantity"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    {nutrition.protein > 0 ? formatCurrency(nutrition.cost / nutrition.protein) : 'N/A'}
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