import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Edit2 } from 'lucide-react';
import { FoodEntry } from '../types';
import { foodDatabase } from '../data/foodDatabase';

interface FoodItemEditProps {
  entry: FoodEntry;
  onSave: (updatedEntry: FoodEntry) => void;
  onCancel: () => void;
}

const FoodItemEdit: React.FC<FoodItemEditProps> = ({ entry, onSave, onCancel }) => {
  const [quantity, setQuantity] = useState<number>(entry.quantity);
  const [unit, setUnit] = useState<string>(entry.unit);
  const [isEditing, setIsEditing] = useState(false);
  
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const food = foodDatabase.find(item => item.id === entry.foodItemId);
  
  // Auto-focus the quantity input when the component mounts
  useEffect(() => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
    }
  }, []);
  
  // Get available units for the food
  const getAvailableUnits = () => {
    const commonUnits = ['g', 'oz', 'cup', 'tbsp', 'tsp'];
    
    if (food) {
      if (!commonUnits.includes(food.servingUnit)) {
        return [...commonUnits, food.servingUnit];
      }
      return commonUnits;
    }
    
    return commonUnits;
  };
  
  const handleSave = () => {
    if (quantity > 0) {
      onSave({
        ...entry,
        quantity,
        unit
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };
  
  const handleFocusClick = () => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          ref={quantityInputRef}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
          onKeyDown={handleKeyDown}
          min="0"
          step="1"
          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        />
        <button
          onClick={handleFocusClick}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Focus input"
        >
          <Edit2 size={14} />
        </button>
      </div>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
      >
        {getAvailableUnits().map(unitOption => (
          <option key={unitOption} value={unitOption}>
            {unitOption}
          </option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={quantity <= 0}
        className="text-green-500 hover:text-green-700 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
        title="Save changes"
      >
        <Check size={18} />
      </button>
      <button
        onClick={onCancel}
        className="text-red-500 hover:text-red-700 transition-colors"
        title="Cancel editing"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default FoodItemEdit; 