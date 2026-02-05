import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Product, Order } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  Activity,
  Star
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customers = users.filter(u => u.role === 'customer');
  const admins = users.filter(u => u.role === 'admin');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalRevenue = orders.filter(o => o.status === 'approved').reduce((sum, order) => sum + order.total, 0);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
      stock: parseInt(newProduct.stock) || 0,
      createdBy: user!.id,
      createdAt: new Date().toISOString()
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
    });
    setShowProductForm(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !newProduct.name || !newProduct.price || !newProduct.category) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || editingProduct.image,
      stock: parseInt(newProduct.stock) || 0
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setNewProduct({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleOrderAction = (orderId: string, action: 'approve' | 'reject') => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: action === 'approve' ? 'approved' : 'rejected',
            approvedAt: new Date().toISOString(),
            approvedBy: user!.id
          }
        : order
    ));
  };

  const stats = [
    { 
      title: 'Jami mijozlar', 
      value: customers.length, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Jami buyurtmalar', 
      value: orders.length, 
      icon: ShoppingBag, 
      color: 'from-emerald-500 to-emerald-600',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'Mahsulotlar', 
      value: products.length, 
      icon: Package, 
      color: 'from-purple-500 to-purple-600',
      change: '+3%',
      trend: 'up'
    },
    { 
      title: 'Jami daromad', 
      value: `$${totalRevenue.toFixed(0)}`, 
      icon: DollarSign, 
      color: 'from-orange-500 to-orange-600',
      change: '+15%',
      trend: 'up'
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">WD</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WEB DUNYOSI</h1>
              <p className="text-gray-600">Admin Panel</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bosh Administrator</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => setActiveTab('orders')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer group hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Buyurtmalarni boshqarish</h3>
                <p className="text-sm text-gray-600">Yangi buyurtmalarni ko'rish va boshqarish</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('customers')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer group hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mijozlar</h3>
                <p className="text-sm text-gray-600">Mijozlar ro'yxati va ma'lumotlari</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('products')}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer group hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mahsulotlar</h3>
                <p className="text-sm text-gray-600">Mahsulotlar ro'yxati va narxlari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        {activeTab === 'dashboard' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">So'nggi buyurtmalar</h2>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>Barchasini ko'rish</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Hozircha buyurtmalar yo'q</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-4">Buyurtma ID</th>
                        <th className="pb-4">Mijoz</th>
                        <th className="pb-4">Jami</th>
                        <th className="pb-4">Holat</th>
                        <th className="pb-4">Sana</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {orders.slice(0, 5).map((order, index) => (
                        <tr key={order.id} className="border-t border-gray-100">
                          <td className="py-4">
                            <span className="font-medium text-gray-900">#{order.id}</span>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{order.customerEmail}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'pending' ? 'Kutilmoqda' :
                               order.status === 'approved' ? 'Tasdiqlandi' : 'Rad etildi'}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mahsulotlar</h2>
                  <p className="text-gray-600">Barcha mahsulotlarni boshqaring</p>
                </div>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  <span>Mahsulot qo'shish</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mahsulotlarni qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:scale-105">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                        <span className="text-xl font-bold text-emerald-600">${product.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Ombor: {product.stock}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-50 text-red-700 py-2 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>O'chirish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Buyurtmalarni boshqarish</h2>
                  <p className="text-gray-600">1 ta buyurtma</p>
                </div>
                <div className="flex items-center space-x-3">
                  <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Barcha buyurtmalar</option>
                    <option>Kutilayotgan</option>
                    <option>Tasdiqlangan</option>
                    <option>Rad etilgan</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Hozircha buyurtmalar yo'q</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-4">ID</th>
                        <th className="pb-4">Mijoz</th>
                        <th className="pb-4">Mahsulotlar</th>
                        <th className="pb-4">Jami</th>
                        <th className="pb-4">Holat</th>
                        <th className="pb-4">Sana</th>
                        <th className="pb-4">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                          <td className="py-4">
                            <span className="font-medium text-gray-900">#{order.id}</span>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{order.customerEmail}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-sm text-gray-600">{order.products.length} ta mahsulot</span>
                          </td>
                          <td className="py-4">
                            <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'pending' ? 'Kutilmoqda' :
                               order.status === 'approved' ? 'Tasdiqlandi' : 'Rad etildi'}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4">
                            {order.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleOrderAction(order.id, 'approve')}
                                  className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleOrderAction(order.id, 'reject')}
                                  className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Mijozlar</h2>
              <p className="text-gray-600">Mijozlar ro'yxati va ma'lumotlari</p>
            </div>
            <div className="p-6">
              {customers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Hozircha mijozlar yo'q</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map(customer => {
                    const customerOrders = orders.filter(o => o.customerId === customer.id);
                    return (
                      <div key={customer.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Qo'shilgan:</span>
                            <span className="text-gray-900">{new Date(customer.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Buyurtmalar:</span>
                            <span className="text-gray-900">{customerOrders.length} ta</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Mahsulot nomi"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Tavsif"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  />
                  <input
                    type="number"
                    placeholder="Narx"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kategoriyani tanlang</option>
                    <option value="clothing">Kiyim</option>
                    <option value="electronics">Elektronika</option>
                    <option value="accessories">Aksessuarlar</option>
                    <option value="home">Uy va bog'</option>
                    <option value="sports">Sport</option>
                  </select>
                  <input
                    type="url"
                    placeholder="Rasm URL (ixtiyoriy)"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Ombor miqdori"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    {editingProduct ? 'Yangilash' : 'Qo\'shish'}
                  </button>
                  <button
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setNewProduct({ name: '', description: '', price: '', category: '', image: '', stock: '' });
                    }}
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