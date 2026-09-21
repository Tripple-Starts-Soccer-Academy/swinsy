import React from 'react';
import { Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">yarichard-international</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2024 yarichard-international. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
