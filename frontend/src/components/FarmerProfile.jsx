import React, { useState } from 'react';
import { Camera, Edit, MapPin, Phone, Mail, Truck, Award, Clipboard, CreditCard, Settings, User } from 'lucide-react';

const FarmerProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Mock farmer data
  const farmerData = {
    name: "John Smith",
    farmName: "Smith Family Organic Farm",
    avatar: "https://t3.ftcdn.net/jpg/04/32/15/18/360_F_432151892_oQ3YQDo2LYZPILlEMnlo55PjjgiUwnQb.jpg",
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhANEFj36kZs4k27bb82_FRsGy0yzxVe-lMw&s",
    location: "Greenfield County, CA",
    phone: "(555) 123-4567",
    email: "john@smithfamilyfarm.com",
    since: "2018",
    bio: "Third-generation farmer specializing in organic vegetables and herbs. We practice sustainable farming methods and take pride in our chemical-free produce.",
    certifications: ["Certified Organic", "Sustainable Agriculture"],
    specialties: ["Heirloom Tomatoes", "Leafy Greens", "Herbs", "Root Vegetables"],
    deliveryOptions: ["Marketplace Pickup", "Farm Gate Sales"],
    bankInfo: {
      accountName: "Smith Family Farm LLC",
      bankName: "Agricultural Credit Union",
      accountType: "Business"
    },
    paymentMethods: ["Cash", "Credit Card", "Mobile Payment"]
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="relative h-48 bg-green-700">
        <img 
          src={farmerData.coverImage} 
          alt="Farm Cover" 
          className="w-full h-full object-cover opacity-60"
        />
        <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md">
          <Camera size={18} className="text-gray-700" />
        </button>
      </div>
      
      {/* Profile Header */}
      <div className="px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-10 mb-6">
          <div className="z-10 mb-4 md:mb-0">
            <div className="relative inline-block">
              <img 
                src={farmerData.avatar} 
                alt={farmerData.name} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white shadow">
                <Camera size={16} />
              </button>
            </div>
          </div>
          
          <div className="md:ml-4 flex flex-col md:flex-row md:items-center justify-between w-full">
            <div className=' flex flex-col justify-center'>
              <h1 className="text-2xl font-bold">{farmerData.farmName}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin size={16} className="mr-1" />
                {farmerData.location}
              </p>
              <p className="text-sm text-gray-500 mt-1">Member since {farmerData.since}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center">
                <Settings size={16} className="mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'personal' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('farm')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'farm' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            Farm Details
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'payment' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            Payment Info
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'history' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            Market History
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="px-6 pb-8">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">About</h2>
                <p className="text-gray-700 mb-4">
                  {farmerData.bio}
                </p>
                
                <h3 className="font-medium mt-6 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Phone size={18} className="mr-2 text-gray-500" />
                    {farmerData.phone}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail size={18} className="mr-2 text-gray-500" />
                    {farmerData.email}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-medium mb-4">Activity Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Markets Attended</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Communities</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products Listed</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Customer Rating</span>
                    <span className="font-medium flex items-center">
                      4.8
                      <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'farm' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Farm Details</h2>
                  <button className="text-green-600 flex items-center text-sm">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <Award size={18} className="mr-2 text-green-600" />
                      Certifications
                    </h3>
                    <div className="space-y-2">
                      {farmerData.certifications.map((cert, index) => (
                        <div key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full inline-block mr-2">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <Clipboard size={18} className="mr-2 text-green-600" />
                      Specialties
                    </h3>
                    <div>
                      {farmerData.specialties.map((specialty, index) => (
                        <div key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full inline-block mr-2 mb-2">
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Truck size={18} className="mr-2 text-green-600" />
                    Delivery Options
                  </h3>
                  <div>
                    {farmerData.deliveryOptions.map((option, index) => (
                      <div key={index} className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full inline-block mr-2">
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-medium mb-4">Top Products</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <img src="/api/placeholder/40/40" alt="Tomatoes" className="w-10 h-10 rounded-lg mr-3" />
                    <div>
                      <h4 className="font-medium">Heirloom Tomatoes</h4>
                      <p className="text-sm text-gray-500">Bestseller</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <img src="/api/placeholder/40/40" alt="Kale" className="w-10 h-10 rounded-lg mr-3" />
                    <div>
                      <h4 className="font-medium">Organic Kale</h4>
                      <p className="text-sm text-gray-500">High demand</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <img src="/api/placeholder/40/40" alt="Bell Peppers" className="w-10 h-10 rounded-lg mr-3" />
                    <div>
                      <h4 className="font-medium">Bell Peppers</h4>
                      <p className="text-sm text-gray-500">Popular</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Payment Information</h2>
                  <button className="text-green-600 flex items-center text-sm">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center">
                    <CreditCard size={18} className="mr-2 text-green-600" />
                    Bank Details
                  </h3>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Account Name</p>
                        <p className="font-medium">{farmerData.bankInfo.accountName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium">{farmerData.bankInfo.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-medium">{farmerData.bankInfo.accountType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="font-medium">•••• •••• •••• 4587</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Accepted Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    {farmerData.paymentMethods.map((method, index) => (
                      <div key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-medium mb-4">Payout Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Balance</span>
                    <span className="font-medium text-green-600">$1,245.80</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-medium">$350.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Payout</span>
                    <span className="font-medium">$875.25</span>
                  </div>
                  <div className="pt-4 border-t">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg">
                      Request Payout
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Monthly Revenue</h2>
                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Revenue chart will appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Market Event History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left">Event</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Location</th>
                      <th className="py-3 px-4 text-left">Revenue</th>
                      <th className="py-3 px-4 text-left">Items Sold</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Downtown Saturday Market</td>
                      <td className="py-3 px-4">Mar 1, 2025</td>
                      <td className="py-3 px-4">Central Plaza</td>
                      <td className="py-3 px-4 font-medium">$364.50</td>
                      <td className="py-3 px-4">32 items</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Westside Community Market</td>
                      <td className="py-3 px-4">Feb 15, 2025</td>
                      <td className="py-3 px-4">Community Center</td>
                      <td className="py-3 px-4 font-medium">$512.75</td>
                      <td className="py-3 px-4">45 items</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Farm Fresh Festival</td>
                      <td className="py-3 px-4">Feb 8, 2025</td>
                      <td className="py-3 px-4">City Park</td>
                      <td className="py-3 px-4 font-medium">$289.25</td>
                      <td className="py-3 px-4">27 items</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Downtown Saturday Market</td>
                      <td className="py-3 px-4">Feb 1, 2025</td>
                      <td className="py-3 px-4">Central Plaza</td>
                      <td className="py-3 px-4 font-medium">$401.00</td>
                      <td className="py-3 px-4">38 items</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;