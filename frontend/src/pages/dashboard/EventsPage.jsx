import React, { useState } from 'react';
import { Calendar, Clock, Upload, X, Plus, Trash2 } from 'lucide-react';

const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Initialize with empty product form
  const emptyProductForm = {
    productName: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    imageUrl: null
  };
  
  // State for current product being added
  const [currentProduct, setCurrentProduct] = useState({...emptyProductForm});
  
  // State for all products for current event
  const [productsList, setProductsList] = useState([]);
  
  // Track which events have stocks prepared
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Downtown Saturday Market",
      date: "March 10, 2025",
      time: "8:00 AM - 1:00 PM",
      description: "Join us for the weekly downtown farmers market featuring fresh produce, handmade goods, and more.",
      daysUntil: 3,
      hasStock: false,
      products: []
    },
    {
      id: 2,
      name: "Westside Community Market",
      date: "March 15, 2025",
      time: "9:00 AM - 2:00 PM",
      description: "Monthly community market featuring local farmers and artisans.",
      daysUntil: 8,
      hasStock: false,
      products: []
    }
  ]);

  const openModal = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
    
    // If event already has products, load them
    if (event.hasStock && event.products.length > 0) {
      setProductsList([...event.products]);
    } else {
      setProductsList([]);
    }
    
    // Reset current product form
    setCurrentProduct({...emptyProductForm});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage("");
    setProductsList([]);
    setCurrentProduct({...emptyProductForm});
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentProduct({
          ...currentProduct,
          imageUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCurrentProduct({
      ...currentProduct,
      imageUrl: null
    });
  };

  // Add current product to the list
  const addProductToList = (e) => {
    e.preventDefault();
    
    // Validate product form
    if (!currentProduct.productName || !currentProduct.quantity || !currentProduct.pricePerUnit) {
      return; // Don't add incomplete products
    }
    
    // Add product to list with a unique ID
    const newProduct = {
      ...currentProduct,
      id: Date.now() // Use timestamp as unique ID
    };
    
    setProductsList([...productsList, newProduct]);
    
    // Reset current product form
    setCurrentProduct({...emptyProductForm});
  };

  // Remove a product from the list
  const removeProduct = (productId) => {
    setProductsList(productsList.filter(product => product.id !== productId));
  };

  // Submit all products
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Don't submit if no products added
    if (productsList.length === 0) {
      return;
    }
    
    // Update the event with all products
    const updatedEvents = events.map(event => 
      event.id === currentEvent.id 
        ? {...event, hasStock: true, products: productsList} 
        : event
    );
    
    setEvents(updatedEvents);
    setSuccessMessage(`Stock has been added to ${currentEvent.name}`);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 3000);
  };

  const getUnitLabel = (unit) => {
    return unit === "kg" ? "kg" : "dozens";
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-medium">Upcoming Marketplace Events</h2>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-medium">{event.name}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-1" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-1" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{event.description}</p>
                {event.hasStock && event.products.length > 0 && (
                  <div className="mt-2">
                    <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mr-2">
                      {event.products.length} products prepared
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex flex-col items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-700">{event.daysUntil}</span>
                  <span className="text-xs text-green-700">days</span>
                </div>
                <button 
                  className={`mt-4 px-4 py-2 ${event.hasStock ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-lg text-sm`}
                  onClick={() => openModal(event)}
                >
                  {event.hasStock ? 'Update Stock' : 'Prepare Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Preparation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Prepare Stock for {currentEvent?.name}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            {successMessage ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
                {successMessage}
              </div>
            ) : (
              <div>
                {/* Product List */}
                {productsList.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-2">Added Products</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {productsList.map((product) => (
                        <div 
                          key={product.id} 
                          className="flex items-center justify-between mb-3 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0"
                        >
                          <div className="flex items-center">
                            {product.imageUrl && (
                              <div className="w-12 h-12 mr-3">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.productName}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{product.productName}</div>
                              <div className="text-sm text-gray-600">
                                {product.quantity} {getUnitLabel(product.unit)} at ${product.pricePerUnit}/{getUnitLabel(product.unit)}
                              </div>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeProduct(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      
                      <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Products:</span>
                          <span>{productsList.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Add New Product Form */}
                <form onSubmit={addProductToList} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-md font-medium mb-2">Add New Product</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Photo
                      </label>
                      {currentProduct.imageUrl ? (
                        <div className="relative">
                          <img 
                            src={currentProduct.imageUrl} 
                            alt="Product" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button 
                            type="button"
                            onClick={removeImage} 
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center h-32 flex flex-col items-center justify-center">
                          <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <label 
                            htmlFor="productImage"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <Upload size={24} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Upload photo</span>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={currentProduct.productName}
                          onChange={handleProductInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="e.g., Organic Carrots"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              name="quantity"
                              value={currentProduct.quantity}
                              onChange={handleProductInputChange}
                              required
                              min="0.1"
                              step="0.1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-l-md"
                              placeholder="e.g., 20"
                            />
                            <select
                              name="unit"
                              value={currentProduct.unit}
                              onChange={handleProductInputChange}
                              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50"
                            >
                              <option value="kg">kg</option>
                              <option value="dozens">dozens</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price per {currentProduct.unit === "kg" ? "kg" : "dozen"} ($)
                          </label>
                          <input
                            type="number"
                            name="pricePerUnit"
                            value={currentProduct.pricePerUnit}
                            onChange={handleProductInputChange}
                            required
                            min="0.1"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 3.50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> Add Product
                    </button>
                  </div>
                </form>
                
                <div className="bg-gray-100 p-3 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Real-time Stock:</span>
                    <span className="text-sm font-medium">
                      {productsList.length > 0 
                        ? `${productsList.length} products ready for market` 
                        : 'No products added yet'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Stock updates will freeze when the event starts
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={productsList.length === 0}
                    className={`px-4 py-2 text-sm rounded-md text-white ${
                      productsList.length === 0 ? 'bg-gray-400' : 'bg-green-600'
                    }`}
                  >
                    Submit All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;