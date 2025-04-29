import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { foodDatabase } from '../data/foodDatabase';
import { FoodEntry } from '../types';

interface FoodItemInputProps {
  onAddFoodItem: (entry: FoodEntry) => void;
}

const FoodItemInput: React.FC<FoodItemInputProps> = ({ onAddFoodItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<string>('g');
  const [isSearching, setIsSearching] = useState(false);
  
  const filteredFoodItems = searchTerm.length > 1
    ? foodDatabase.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  const selectedFood = foodDatabase.find(item => item.id === selectedFoodId);
  
  const handleSearchFocus = () => {
    setIsSearching(true);
  };
  
  const handleSearchBlur = () => {
    // Only hide results after a delay to allow click events to register
    setTimeout(() => {
      if (!selectedFoodId) {
        setSearchTerm('');
      }
      setIsSearching(false);
    }, 200);
  };
  
  const handleFoodItemSelect = (id: string) => {
    const food = foodDatabase.find(item => item.id === id);
    if (food) {
      setSelectedFoodId(id);
      setSearchTerm(food.name);
      setUnit(food.servingUnit);
      setIsSearching(false);
    }
  };
  
  const handleAddFoodItem = () => {
    if (selectedFoodId && quantity > 0) {
      onAddFoodItem({
        foodItemId: selectedFoodId,
        quantity,
        unit
      });
      
      // Reset form
      setSearchTerm('');
      setSelectedFoodId('');
      setQuantity(100);
      setUnit('g');
    }
  };
  
  // Get available units for the selected food
  const getAvailableUnits = () => {
    const commonUnits = ['g', 'oz', 'cup', 'tbsp', 'tsp'];
    
    if (selectedFood) {
      if (!commonUnits.includes(selectedFood.servingUnit)) {
        return [...commonUnits, selectedFood.servingUnit];
      }
      return commonUnits;
    }
    
    return commonUnits;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 relative transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Food Item</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        {/* Food Search Field */}
        <div className="md:col-span-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Item
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!e.target.value) {
                  setSelectedFoodId('');
                }
              }}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search for a food item..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* Search Results Dropdown */}
          {isSearching && filteredFoodItems.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200 animate-fade-in">
              {filteredFoodItems.map(item => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onMouseDown={() => handleFoodItemSelect(item.id)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.calories} cal | {item.protein}g protein | {item.carbs}g carbs | {item.fat}g fat
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isSearching && searchTerm.length > 1 && filteredFoodItems.length === 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-3 border border-gray-200">
              <p className="text-gray-500">No food items found</p>
            </div>
          )}
        </div>
        
        {/* Quantity Input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
            min="0"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
        
        {/* Unit Selection */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          >
            {getAvailableUnits().map(unitOption => (
              <option key={unitOption} value={unitOption}>
                {unitOption}
              </option>
            ))}
          </select>
        </div>
        
        {/* Add Button */}
        <div className="md:col-span-1">
          <label className="hidden md:block text-sm font-medium text-transparent mb-1">
            Action
          </label>
          <button
            onClick={handleAddFoodItem}
            disabled={!selectedFoodId || quantity <= 0}
            className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus size={18} className="mr-1" />
            Add
          </button>
        </div>
      </div>
      
      {/* Selected Food Preview */}
      {selectedFood && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{selectedFood.name}</h3>
              <p className="text-sm text-gray-600">
                {selectedFood.calories} cal per 100g | {selectedFood.protein}g protein
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">
                Standard serving: {selectedFood.servingSize}{selectedFood.servingUnit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemInput;