import React, { useState } from 'react';

const StockPage = () => {
  // Initial stock and revenue state
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Organic Tomatoes',
      stock: 25,
      unit: 'kg',
      price: 3.50,
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQAOpGpc-kiO1H-awMfLOrgBoi20cQv43EnRL6QvT1eKgWgczRjzXfg7J0kUIq-Z2K8qBZx0-Haz9PnMRXJswB5AQ',
    },
    {
      id: 2,
      name: 'Fresh Carrots',
      stock: 18,
      unit: 'kg',
      price: 2.25,
      image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/plant-seed/1/c/c/150-carrot-bs-150pp-98-sree-original-imagsrzuww9bgqff.jpeg?q=90&crop=false',
    },
    {
      id: 3,
      name: 'Organic Lettuce',
      stock: 12,
      unit: 'kg',
      price: 4.00,
      image: 'https://cdn.britannica.com/77/170677-050-F7333D51/lettuce.jpg',
    }
  ]);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesInput, setSalesInput] = useState({});

  // Handle quantity input change
  const handleQuantityChange = (id, value) => {
    setSalesInput({
      ...salesInput,
      [id]: parseInt(value) || 0
    });
  };

  // Handle product sale
  const handleSale = (id) => {
    const productIndex = products.findIndex(p => p.id === id);
    const product = products[productIndex];
    const saleQuantity = salesInput[id] || 0;
    
    // Validate quantity
    if (saleQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    if (saleQuantity > product.stock) {
      alert('Not enough stock available');
      return;
    }
    
    // Calculate sale revenue
    const saleRevenue = saleQuantity * product.price;
    
    // Update product stock
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...product,
      stock: product.stock - saleQuantity
    };
    
    // Update state
    setProducts(updatedProducts);
    setTotalRevenue(totalRevenue + saleRevenue);
    
    // Clear input
    setSalesInput({
      ...salesInput,
      [id]: 0
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-xl font-medium">Current Stock</h2>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <span className="font-medium">Total Revenue: ${totalRevenue.toFixed(2)}</span>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2">
            <span>Add New Product</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="h-40 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <img src={product.image} alt={product.name} className="h-32 rounded-lg" />
            </div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className={`${product.stock === 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                {product.stock === 0 ? 'OUT OF STOCK' : `Stock: ${product.stock} ${product.unit}`}
              </span>
              <span className="font-medium text-green-600">${product.price.toFixed(2)}/{product.unit}</span>
            </div>
            
            {product.stock > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={salesInput[product.id] || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder={`Qty (max ${product.stock})`}
                  />
                  <button 
                    onClick={() => handleSale(product.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium"
                  >
                    Sell
                  </button>
                </div>
                <div className="flex">
                  <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                    Update Stock
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <button className="w-full px-3 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm cursor-not-allowed">
                  Out of Stock
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockPage;