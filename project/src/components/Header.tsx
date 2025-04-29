import React from 'react';
import { ChefHat } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-6 px-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <ChefHat size={32} className="mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold">NutriCalc Pro</h1>
        </div>
        <div className="text-sm md:text-base text-center md:text-right">
          <p className="opacity-90">Detailed nutritional analysis & cost breakdown</p>
          <p className="opacity-75 text-xs mt-1">Accurate data. Beautiful insights.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;