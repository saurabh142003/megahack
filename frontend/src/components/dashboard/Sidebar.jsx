import React from 'react';
import { Bell, Calendar, DollarSign, Map, Package, PieChart, User, Users } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-20 bg-green-800 flex flex-col items-center py-6">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-8">
        <img src="/api/placeholder/40/40" alt="Logo" className="w-10 h-10 rounded-full" />
      </div>
      
      <div className="flex flex-col items-center space-y-6 mt-4">
        <button 
          onClick={() => setActiveTab('communities')}
          className={`p-3 rounded-xl ${activeTab === 'communities' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>
          <Users size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`p-3 rounded-xl ${activeTab === 'events' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>
          <Calendar size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`p-3 rounded-xl ${activeTab === 'stock' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>
          <Package size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`p-3 rounded-xl ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>
          <PieChart size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`p-3 rounded-xl ${activeTab === 'profile' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>
          <User size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 