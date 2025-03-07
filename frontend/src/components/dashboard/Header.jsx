import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ activeTab }) => {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          {activeTab === 'communities' && 'Marketplace Communities'}
          {activeTab === 'events' && 'Marketplace Events'}
          {activeTab === 'stock' && 'Stock Management'}
          {activeTab === 'analytics' && 'Sales Analytics'}
          {activeTab === 'profile' && 'Farmer Profile'}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <img src="/api/placeholder/32/32" alt="Farmer" className="w-8 h-8 rounded-full" />
            </div>
            <span className="font-medium">John's Farm</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 