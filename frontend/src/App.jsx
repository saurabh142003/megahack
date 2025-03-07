import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FarmerDashboard from './pages/FarmerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/communities" replace />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/communities" replace />} />
        <Route path="/dashboard/*" element={<FarmerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
