import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, MapPin, Calendar, User } from 'lucide-react';
import { marketplaceAPI } from '../api/marketplace';
import MarketplaceCard from '../components/MarketplaceCard';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: string;
  donor_id: string;
  donor_name: string;
  status: 'available' | 'claimed';
  created_at: string;
  location: string;
  category: string;
}

function Marketplace() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains' },
    { value: 'protein', label: 'Protein' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'canned', label: 'Canned Goods' }
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const response = await marketplaceAPI.getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
      // Mock data for demo
      setItems([
        {
          id: '1',
          name: 'Fresh Organic Vegetables',
          description: 'Mixed seasonal vegetables from local farm',
          quantity: '5 kg',
          donor_id: '1',
          donor_name: 'Green Valley Farm',
          status: 'available',
          created_at: '2025-01-12T10:30:00Z',
          location: 'Downtown Community Center',
          category: 'vegetables'
        },
        {
          id: '2',
          name: 'Canned Goods Collection',
          description: 'Assorted canned foods, soups, and preserves',
          quantity: '20 cans',
          donor_id: '2',
          donor_name: 'Local Grocery Store',
          status: 'available',
          created_at: '2025-01-12T08:15:00Z',
          location: 'Westside Food Bank',
          category: 'canned'
        },
        {
          id: '3',
          name: 'Fresh Bread & Pastries',
          description: 'Day-old bread and pastries from bakery',
          quantity: '15 items',
          donor_id: '3',
          donor_name: 'Sunshine Bakery',
          status: 'claimed',
          created_at: '2025-01-11T18:00:00Z',
          location: 'Central Plaza',
          category: 'grains'
        },
        {
          id: '4',
          name: 'Protein Package',
          description: 'Frozen chicken and fish portions',
          quantity: '3 kg',
          donor_id: '4',
          donor_name: 'Community Kitchen',
          status: 'available',
          created_at: '2025-01-11T14:20:00Z',
          location: 'Northside Center',
          category: 'protein'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleClaimItem = async (itemId: string) => {
    try {
      await marketplaceAPI.claimItem(itemId);
      setItems(items.map(item => 
        item.id === itemId ? { ...item, status: 'claimed' } : item
      ));
    } catch (error) {
      console.error('Error claiming item:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Food <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Marketplace</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover available food donations in your community and help reduce waste.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MarketplaceCard
              key={item.id}
              item={item}
              onClaim={() => handleClaimItem(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

export default Marketplace;