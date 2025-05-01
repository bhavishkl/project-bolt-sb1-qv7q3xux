import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Printer, Info, PieChart, Calculator, Target, Award, Zap, Scale } from 'lucide-react';
import { NutritionTotals } from '../types';
import { formatCurrency, formatNumber, generateDietaryWarnings } from '../utils/nutritionCalculator';

interface NutritionSummaryProps {
  nutritionTotals: NutritionTotals;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutritionTotals }) => {
  const [micronutrientsExpanded, setMicronutrientsExpanded] = useState(false);
  const warnings = generateDietaryWarnings(nutritionTotals);
  
  // Calculate macro percentages and daily targets
  const totalCaloriesFromMacros = 
    (nutritionTotals.protein * 4) + 
    (nutritionTotals.carbs * 4) + 
    (nutritionTotals.fat * 9);
  
  const proteinPercentage = Math.round((nutritionTotals.protein * 4 * 100) / totalCaloriesFromMacros) || 0;
  const carbsPercentage = Math.round((nutritionTotals.carbs * 4 * 100) / totalCaloriesFromMacros) || 0;
  const fatPercentage = Math.round((nutritionTotals.fat * 9 * 100) / totalCaloriesFromMacros) || 0;

  // Daily targets (based on common recommendations)
  const dailyTargets = {
    calories: 2000,
    protein: 50, // minimum
    fiber: 25,
    sugar: 50, // maximum
  };

  // Calculate achievement percentages
  const getAchievementPercent = (value: number, target: number, isMax = false) => {
    const percent = (value / target) * 100;
    return isMax ? Math.min(100, (1 - Math.min(1, percent))) * 100 : Math.min(percent, 100);
  };

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
  
  // Get key deficiencies and excesses
  const getKeyNutrientStatus = () => {
    const deficiencies: { name: string; value: number }[] = [];
    const excesses: { name: string; value: number }[] = [];
    
    Object.entries(nutritionTotals.micronutrients).forEach(([key, value]) => {
      if (value.percentDailyValue < 30) {
        deficiencies.push({ name: key, value: value.percentDailyValue });
      } else if (value.percentDailyValue > 150) {
        excesses.push({ name: key, value: value.percentDailyValue });
      }
    });

    return { deficiencies, excesses };
  };

  const { deficiencies, excesses } = getKeyNutrientStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6 print:shadow-none animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Target className="mr-2" size={20} />
          Nutrition Insights
        </h2>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm print:hidden"
        >
          <Printer size={16} className="mr-1" />
          Print
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Key Metrics */}
        <div>
          {/* Daily Goals Progress */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Award className="mr-2" size={18} />
              Daily Goals Progress
            </h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              {/* Calories */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Calories</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(nutritionTotals.calories)} / {dailyTargets.calories}
                  </span>
                </div>
                {renderProgressBar(nutritionTotals.calories, dailyTargets.calories, 'bg-blue-500')}
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Protein</span>
                  <span className="text-sm text-gray-500">
                    {formatNumber(nutritionTotals.protein)}g / {dailyTargets.protein}g
                  </span>
                </div>
                {renderProgressBar(nutritionTotals.protein, dailyTargets.protein, 'bg-green-500')}
              </div>

              {/* Fiber */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Fiber</span>
                  <span className="text-sm text-gray-500">
                    {formatNumber(nutritionTotals.fiber)}g / {dailyTargets.fiber}g
                  </span>
                </div>
                {renderProgressBar(nutritionTotals.fiber, dailyTargets.fiber, 'bg-yellow-500')}
              </div>

              {/* Sugar (inverse progress) */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Sugar (limit)</span>
                  <span className="text-sm text-gray-500">
                    {formatNumber(nutritionTotals.sugar)}g / {dailyTargets.sugar}g
                  </span>
                </div>
                {renderProgressBar(
                  getAchievementPercent(nutritionTotals.sugar, dailyTargets.sugar, true),
                  100,
                  'bg-red-500'
                )}
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Calculator className="mr-2" size={18} />
              Cost Analysis
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-xl font-bold text-teal-600">{formatCurrency(nutritionTotals.cost)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost per 100 cal</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency((nutritionTotals.cost / nutritionTotals.calories) * 100)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost per serving</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(nutritionTotals.cost / Math.max(1, nutritionTotals.servings))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost per protein g</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(nutritionTotals.cost / Math.max(1, nutritionTotals.protein))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Nutrient Analysis */}
        <div>
          {/* Key Findings */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Zap className="mr-2" size={18} />
              Key Findings
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {/* Deficiencies */}
              {deficiencies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-red-600 mb-2">Nutrient Deficiencies</h4>
                  <ul className="space-y-1">
                    {deficiencies.map(({ name, value }) => (
                      <li key={name} className="text-sm text-gray-600 flex justify-between">
                        <span className="capitalize">{name}</span>
                        <span className="text-red-500">{Math.round(value)}% DV</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Excesses */}
              {excesses.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-yellow-600 mb-2">Nutrient Excesses</h4>
                  <ul className="space-y-1">
                    {excesses.map(({ name, value }) => (
                      <li key={name} className="text-sm text-gray-600 flex justify-between">
                        <span className="capitalize">{name}</span>
                        <span className="text-yellow-500">{Math.round(value)}% DV</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {deficiencies.length === 0 && excesses.length === 0 && (
                <p className="text-sm text-green-600">All nutrients are within recommended ranges!</p>
              )}
            </div>
          </div>
          
          {/* Macro Distribution */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <PieChart className="mr-2" size={18} />
              Macro Distribution
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="h-4 flex rounded-full overflow-hidden mb-3">
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
              <div className="flex justify-between text-xs text-gray-500">
                <span>Protein {proteinPercentage}%</span>
                <span>Carbs {carbsPercentage}%</span>
                <span>Fat {fatPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Micronutrients Section */}
      <div className="mt-6">
        <div 
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setMicronutrientsExpanded(!micronutrientsExpanded)}
        >
          <h3 className="font-medium text-gray-800 flex items-center">
            <Scale className="mr-2" size={18} />
            Detailed Micronutrients
          </h3>
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
              <span>Status indicators: <span className="text-red-600">Low</span> | <span className="text-green-600">Good</span> | <span className="text-yellow-600">High</span> | <span className="text-red-600">Excess</span></span>
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
                {Object.entries(nutritionTotals.micronutrients)
                  .sort((a, b) => b[1].percentDailyValue - a[1].percentDailyValue)
                  .map(([key, value]) => {
                    const { status, color, bgColor } = getMicronutrientStatus(value.percentDailyValue);
                    return (
                      <tr key={key} className="border-b border-gray-200">
                        <td className="py-2 text-gray-600 capitalize">{key}</td>
                        <td className="py-2 text-right">{formatNumber(value.amount)} {value.unit}</td>
                        <td className="py-2 text-right">{formatNumber(value.percentDailyValue)}%</td>
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
      
      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="mt-6 p-3 bg-amber-50 border border-amber-300 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-500 mt-1 mr-2 shrink-0" size={20} />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Recommendations</h3>
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