import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Printer, Info } from 'lucide-react';
import { NutritionTotals } from '../types';
import { formatCurrency, formatNumber, generateDietaryWarnings } from '../utils/nutritionCalculator';

interface NutritionSummaryProps {
  nutritionTotals: NutritionTotals;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutritionTotals }) => {
  const [micronutrientsExpanded, setMicronutrientsExpanded] = useState(false);
  const warnings = generateDietaryWarnings(nutritionTotals);
  
  // Calculate macro percentages
  const totalCaloriesFromMacros = 
    (nutritionTotals.protein * 4) + 
    (nutritionTotals.carbs * 4) + 
    (nutritionTotals.fat * 9);
  
  const proteinPercentage = Math.round((nutritionTotals.protein * 4 * 100) / totalCaloriesFromMacros) || 0;
  const carbsPercentage = Math.round((nutritionTotals.carbs * 4 * 100) / totalCaloriesFromMacros) || 0;
  const fatPercentage = Math.round((nutritionTotals.fat * 9 * 100) / totalCaloriesFromMacros) || 0;
  
  // Helper to render progress bar
  const renderProgressBar = (value: number, max: number, color: string) => {
    const percentage = Math.min(100, (value / max) * 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };
  
  // Helper to determine RDA status and color for micronutrients
  const getMicronutrientStatus = (percentDailyValue: number): { status: string; color: string; bgColor: string } => {
    if (percentDailyValue < 50) {
      return { status: 'Low', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (percentDailyValue >= 50 && percentDailyValue <= 150) {
      return { status: 'Good', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (percentDailyValue > 150 && percentDailyValue <= 200) {
      return { status: 'High', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { status: 'Excess', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // No food items added yet
  if (nutritionTotals.calories === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Summary</h2>
        <div className="p-8 text-center text-gray-500">
          <p>Add food items to see the nutrition summary</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 print:shadow-none animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Nutrition Summary</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrint}
            className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm print:hidden"
          >
            <Printer size={16} className="mr-1" />
            Print
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Overall Summary */}
        <div>
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Overall Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Calories</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(nutritionTotals.calories)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-2xl font-bold text-teal-600">{formatCurrency(nutritionTotals.cost)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost Per Serving</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(nutritionTotals.cost / Math.max(1, nutritionTotals.servings))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost Per 100 Calories</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency((nutritionTotals.cost / nutritionTotals.calories) * 100)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Macro Breakdown */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Macronutrient Breakdown</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {/* Protein */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-blue-700">Protein</span>
                    <span className="text-xs text-gray-500 ml-2">{formatNumber(nutritionTotals.protein)}g</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{proteinPercentage}%</span>
                </div>
                {renderProgressBar(nutritionTotals.protein, 150, 'bg-blue-500')}
              </div>
              
              {/* Carbs */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-green-700">Carbs</span>
                    <span className="text-xs text-gray-500 ml-2">{formatNumber(nutritionTotals.carbs)}g</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{carbsPercentage}%</span>
                </div>
                {renderProgressBar(nutritionTotals.carbs, 300, 'bg-green-500')}
              </div>
              
              {/* Fat */}
              <div>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-yellow-700">Fat</span>
                    <span className="text-xs text-gray-500 ml-2">{formatNumber(nutritionTotals.fat)}g</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{fatPercentage}%</span>
                </div>
                {renderProgressBar(nutritionTotals.fat, 65, 'bg-yellow-500')}
              </div>
              
              {/* Macro Chart */}
              <div className="mt-5 h-4 flex rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${proteinPercentage}%` }}
                ></div>
                <div 
                  className="bg-green-500 transition-all duration-500"
                  style={{ width: `${carbsPercentage}%` }}
                ></div>
                <div 
                  className="bg-yellow-500 transition-all duration-500"
                  style={{ width: `${fatPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Protein {proteinPercentage}%</span>
                <span>Carbs {carbsPercentage}%</span>
                <span>Fat {fatPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Detailed Breakdown */}
        <div>
          {/* Detailed Macros */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Detailed Nutrients</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Calories</td>
                    <td className="py-2 text-right font-medium">{Math.round(nutritionTotals.calories)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Protein</td>
                    <td className="py-2 text-right font-medium">{formatNumber(nutritionTotals.protein)}g</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 text-gray-600">Carbohydrates</td>
                    <td className="py-2 text-right font-medium">{formatNumber(nutritionTotals.carbs)}g</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pl-4 text-gray-500">- Sugar</td>
                    <td className="py-2 text-right">{formatNumber(nutritionTotals.sugar)}g</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 pl-4 text-gray-500">- Fiber</td>
                    <td className="py-2 text-right">{formatNumber(nutritionTotals.fiber)}g</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Fat</td>
                    <td className="py-2 text-right font-medium">{formatNumber(nutritionTotals.fat)}g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Micronutrients */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setMicronutrientsExpanded(!micronutrientsExpanded)}
            >
              <h3 className="font-medium text-gray-800">Micronutrients</h3>
              {micronutrientsExpanded ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </div>
            
            {micronutrientsExpanded && (
              <div className="bg-gray-50 p-4 rounded-md animate-fade-in">
                <div className="mb-3 flex items-center text-xs text-gray-500">
                  <Info size={14} className="mr-1" />
                  <span>Color indicators show RDA meeting status: <span className="text-red-600">Low</span> | <span className="text-green-600">Good</span> | <span className="text-yellow-600">High</span> | <span className="text-red-600">Excess</span></span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left text-gray-600 font-medium">Nutrient</th>
                      <th className="py-2 text-right text-gray-600 font-medium">Amount</th>
                      <th className="py-2 text-right text-gray-600 font-medium">% Daily Value</th>
                      <th className="py-2 text-center text-gray-600 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(nutritionTotals.micronutrients).map(([key, value]) => {
                      const { status, color, bgColor } = getMicronutrientStatus(value.percentDailyValue);
                      return (
                        <tr key={key} className="border-b border-gray-200">
                          <td className="py-2 text-gray-600 capitalize">{key}</td>
                          <td className="py-2 text-right">{formatNumber(value.amount)} {value.unit}</td>
                          <td className="py-2 text-right">
                            {formatNumber(value.percentDailyValue)}%
                          </td>
                          <td className="py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dietary Considerations moved to the very bottom */}
      {warnings.length > 0 && (
        <div className="mt-6 p-3 bg-amber-50 border border-amber-300 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-500 mt-1 mr-2 shrink-0" size={20} />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Dietary Considerations</h3>
              <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionSummary;