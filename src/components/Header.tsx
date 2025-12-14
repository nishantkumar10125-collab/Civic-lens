import React from 'react';
import { Camera, MapPin, Menu } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CivicLens</h1>
              <p className="text-sm text-gray-600">AI-Powered City Issue Reporter</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onViewChange('report')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'report' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
            
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </nav>
          
          <div className="md:hidden">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};