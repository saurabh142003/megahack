import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import CommunitiesPage from './dashboard/CommunitiesPage';
import StockPage from './dashboard/StockPage';
import EventsPage from './dashboard/EventsPage';
import AnalyticsPage from './dashboard/AnalyticsPage';
import FarmerProfile from '../components/FarmerProfile';

const FarmerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the active tab from the URL path
  const activeTab = location.pathname.split('/').pop() || 'communities';
  
  const handleTabChange = (tab) => {
    navigate(`/dashboard/${tab}`);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === 'communities' && <CommunitiesPage />}
          {activeTab === 'stock' && <StockPage />}
          {activeTab === 'events' && <EventsPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'profile' && <FarmerProfile />}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;