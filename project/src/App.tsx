import  { useState, useEffect } from 'react';
import Header from './components/Header';
import FoodItemInput from './components/FoodItemInput';
import FoodItemList from './components/FoodItemList';
import NutritionSummary from './components/NutritionSummary';
import Footer from './components/Footer';
import { FoodEntry } from './types';
import { calculateTotalNutrition } from './utils/nutritionCalculator';

// Add some global styles
import './index.css';

function App() {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  
  // Load food entries from localStorage on initial load
  useEffect(() => {
    const savedEntries = localStorage.getItem('foodEntries');
    if (savedEntries) {
      try {
        setFoodEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error loading saved food entries:', error);
      }
    }
  }, []);
  
  // Save food entries to localStorage whenever they change.
  // If no items remain, remove the key from localStorage.
  useEffect(() => {
    if (foodEntries.length > 0) {
      localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
    } else {
      localStorage.removeItem('foodEntries');
    }
  }, [foodEntries]);
  
  const handleAddFoodItem = (entry: FoodEntry) => {
    setFoodEntries([...foodEntries, entry]);
  };
  
  const handleRemoveFoodItem = (index: number) => {
    setFoodEntries(foodEntries.filter((_, i) => i !== index));
  };
  
  const handleUpdateFoodItem = (index: number, updatedEntry: FoodEntry) => {
    const newEntries = [...foodEntries];
    newEntries[index] = updatedEntry;
    setFoodEntries(newEntries);
  };
  
  const nutritionTotals = calculateTotalNutrition(foodEntries);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <FoodItemInput onAddFoodItem={handleAddFoodItem} />
        <FoodItemList 
          foodEntries={foodEntries} 
          onRemoveFoodItem={handleRemoveFoodItem}
          onUpdateFoodItem={handleUpdateFoodItem}
        />
        <NutritionSummary nutritionTotals={nutritionTotals} />
        
        {/* Action Buttons */}
        {foodEntries.length > 0 && (
          <div className="flex justify-end space-x-3 mb-6">
            <button
              onClick={() => setFoodEntries([])}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm print:hidden"
            >
              Clear All Items
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;