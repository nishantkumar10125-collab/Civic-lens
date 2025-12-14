import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReportForm } from './components/ReportForm';
import { Dashboard } from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('report');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="py-8">
        {currentView === 'report' && <ReportForm />}
        {currentView === 'dashboard' && <Dashboard />}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              CivicLens - Making cities better through AI-powered issue reporting
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;