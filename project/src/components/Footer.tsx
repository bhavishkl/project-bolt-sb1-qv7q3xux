import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4">
      <div className="container mx-auto text-center">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} NutriCalc Pro. All nutritional data is approximate and based on standard references.
        </p>
        <p className="text-xs mt-2 opacity-60">
          Nutritional information may vary based on specific brands and preparation methods.
          Always consult with a qualified healthcare professional before making dietary changes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;