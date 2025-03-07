import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DollarSign, Package, TrendingUp, Calendar } from 'lucide-react';

// Sample data - in a real app this would come from an API
const weeklyData = [
  { name: 'Mon', sales: 420 },
  { name: 'Tue', sales: 380 },
  { name: 'Wed', sales: 510 },
  { name: 'Thu', sales: 490 },
  { name: 'Fri', sales: 600 },
  { name: 'Sat', sales: 720 },
  { name: 'Sun', sales: 450 }
];

const monthlyData = [
  { name: 'Jan', sales: 4200 },
  { name: 'Feb', sales: 3800 },
  { name: 'Mar', sales: 5100 },
  { name: 'Apr', sales: 4900 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 7200 },
  { name: 'Jul', sales: 6800 },
  { name: 'Aug', sales: 7100 },
  { name: 'Sep', sales: 6500 },
  { name: 'Oct', sales: 5800 },
  { name: 'Nov', sales: 5200 },
  { name: 'Dec', sales: 6300 }
];

const yearlyData = [
  { name: '2020', sales: 52000 },
  { name: '2021', sales: 58000 },
  { name: '2022', sales: 65000 },
  { name: '2023', sales: 72000 },
  { name: '2024', sales: 83000 }
];

const productData = [
  { name: 'Tomatoes', value: 35 },
  { name: 'Potatoes', value: 25 },
  { name: 'Lettuce', value: 20 },
  { name: 'Carrots', value: 15 },
  { name: 'Other', value: 5 }
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FarmerSalesDashboard = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  
  // Get current data based on selected timeframe
  const getCurrentData = () => {
    switch(timeframe) {
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return yearlyData;
      default:
        return weeklyData;
    }
  };
  
  // Calculate total sales for the current timeframe
  const calculateTotal = () => {
    return getCurrentData().reduce((sum, item) => sum + item.sales, 0);
  };
  
  // Calculate the percentage change from previous period
  const calculateChange = () => {
    const data = getCurrentData();
    if (data.length < 2) return 0;
    const current = data[data.length - 1].sales;
    const previous = data[data.length - 2].sales;
    return ((current - previous) / previous * 100).toFixed(1);
  };
  
  const change = calculateChange();
  const isPositive = parseFloat(change) >= 0;
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Farm Sales Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total Sales</h3>
              <p className="text-2xl font-bold">${calculateTotal().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Package size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Products Sold</h3>
              <p className="text-2xl font-bold">847 kg</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${isPositive ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mr-4`}>
              <TrendingUp size={24} className={isPositive ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Growth</h3>
              <p className="text-2xl font-bold">{isPositive ? '+' : ''}{change}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Best Selling Day</h3>
              <p className="text-2xl font-bold">Saturday</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeframe Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium">Sales Performance</h2>
          <div className="ml-auto">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
                onClick={() => setTimeframe('weekly')}
              >
                Weekly
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-t border-b border-gray-200'}`}
                onClick={() => setTimeframe('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeframe === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
                onClick={() => setTimeframe('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>
        
        {/* Sales Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === 'yearly' ? (
              <BarChart
                data={yearlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => ['$' + value.toLocaleString(), 'Sales']}
                />
                <Legend />
                <Bar dataKey="sales" fill="#4f46e5" name="Sales ($)" />
              </BarChart>
            ) : (
              <LineChart
                data={timeframe === 'monthly' ? monthlyData : weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => ['$' + value.toLocaleString(), 'Sales']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Sales ($)"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Additional Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Product Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Sales Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Comparison with Previous Period */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Comparison with Previous {timeframe.charAt(0).toUpperCase() + timeframe.slice(1, -2)}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Previous',
                    value: timeframe === 'weekly' ? 3200 : timeframe === 'monthly' ? 58000 : 72000
                  },
                  {
                    name: 'Current',
                    value: timeframe === 'weekly' ? 3570 : timeframe === 'monthly' ? 65000 : 83000
                  }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Sales']} />
                <Bar dataKey="value" fill="#4f46e5" name="Sales ($)">
                  <Cell fill="#9f9fed" />
                  <Cell fill="#4f46e5" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSalesDashboard;