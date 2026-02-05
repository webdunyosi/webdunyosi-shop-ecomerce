import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, CartItem } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Settings,
  Camera,
  Search,
  Filter,
  Star,
  Heart,
  Eye,
  Grid,
  List
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products] = useLocalStorage<Product[]>('products', []);
  const [orders] = useLocalStorage<Order[]>('orders', []);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  const customerOrders = orders.filter(o => o.customerId === user?.id);
  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: string) => {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0 || !user) return;

    const orderProducts = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        price: product?.price || 0
      };
    });

    const newOrder: Order = {
      id: Date.now().toString(),
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      products: orderProducts,
      total: getCartTotal(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...currentOrders, newOrder]));
    
    setCart([]);
    setShowCart(false);
    alert('Buyurtma muvaffaqiyatli berildi! Admin tasdig\'ini kuting.');
  };

  const handleProfileUpdate = () => {
    updateProfile(profileForm);
    setShowProfile(false);
    alert('Profil muvaffaqiyatli yangilandi!');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileForm({ ...profileForm, avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xush kelibsiz, {user?.name}!</h1>
            <p className="text-gray-600">Ajoyib mahsulotlarni kashf eting</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowProfile(true)}
              className="p-3 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-blue-600 transition-colors rounded-2xl shadow-lg hover:shadow-xl border border-white/20"
              title="Profil sozlamalari"
            >
              <Settings className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-3xl mb-8 shadow-lg border border-white/20">
          {[
            { id: 'products', label: 'Mahsulotlar', icon: Package },
            { id: 'orders', label: 'Mening buyurtmalarim', icon: ShoppingCart }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Mahsulotlarni qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Barcha kategoriyalar</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="flex bg-gray-50 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(product => (
                <div key={product.id} className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-105 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`object-cover group-hover:scale-110 transition-transform duration-300 ${
                        viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                      }`}
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                        <span className="text-xl font-bold text-emerald-600">${product.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Ombor: {product.stock}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.stock === 0 ? 'Tugagan' : 'Savatga qo\'shish'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Mahsulotlar topilmadi</p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Mening buyurtmalarim</h2>
              <p className="text-gray-600">Barcha buyurtmalaringizni kuzatib boring</p>
            </div>
            <div className="p-6">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Siz hali buyurtma bermagansiz</p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Xarid qilishni boshlash
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {customerOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">Buyurtma #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()} da berilgan
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold">${order.total.toFixed(2)}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
                              {order.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
                              {order.status === 'rejected' && <XCircle className="h-4 w-4 mr-1" />}
                              {order.status === 'pending' ? 'Kutilmoqda' :
                               order.status === 'approved' ? 'Tasdiqlandi' : 'Rad etildi'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-medium mb-4">Buyurtma mahsulotlari:</h4>
                        <div className="space-y-3">
                          {order.products.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <span className="font-medium">{item.productName}</span>
                                <span className="text-gray-600 ml-2">x{item.quantity}</span>
                              </div>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Savat</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Savatingiz bo'sh</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;
                        
                        return (
                          <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">${product.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateCartQuantity(item.productId, 0)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold">Jami:</span>
                        <span className="text-2xl font-bold text-emerald-600">${getCartTotal().toFixed(2)}</span>
                      </div>
                      <button
                        onClick={placeOrder}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Buyurtma berish
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profil sozlamalari</h3>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                        {profileForm.avatar ? (
                          <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-white" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="To'liq ism"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <input
                      type="email"
                      placeholder="Email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <input
                      type="tel"
                      placeholder="Telefon raqami"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <textarea
                      placeholder="Manzil"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    Profilni yangilash
                  </button>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};