import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Noto\'g\'ri email yoki parol');
        }
      } else {
        const success = await register(email, password, name, role);
        if (!success) {
          setError('Bu email bilan foydalanuvchi allaqachon mavjud');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const adminAccounts = [
    { email: 'admin@example.com', name: 'John Smith' },
    { email: 'sarah.admin@example.com', name: 'Sarah Johnson' },
    { email: 'mike.admin@example.com', name: 'Mike Wilson' },
    { email: 'emma.admin@example.com', name: 'Emma Davis' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <div className="text-white font-bold text-2xl">WD</div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Xush kelibsiz!' : 'Ro\'yxatdan o\'ting'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isLogin ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
          </p>
          <p className="text-sm text-gray-600">
            {isLogin ? "Hisobingiz yo'qmi? " : "Allaqachon hisobingiz bormi? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors underline"
            >
              {isLogin ? 'Ro\'yxatdan o\'ting' : 'Kirish'}
            </button>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  To'liq ism
                </label>
                <input
                  id="name"
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Ismingizni kiriting"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email manzil
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Email manzilingizni kiriting"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Parol
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Parolingizni kiriting"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Hisob turi
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'customer')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                >
                  <option value="customer">Mijoz</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              </span>
              {loading ? 'Jarayon...' : (isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish')}
            </button>

            {isLogin && (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600 bg-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/50">
                  <strong className="text-blue-800">Demo Admin Hisoblar:</strong>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {adminAccounts.map((admin, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white/50 rounded-xl">
                        <span className="font-medium text-gray-700">{admin.name}</span>
                        <button
                          type="button"
                          onClick={() => setEmail(admin.email)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Tanlash
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    (Har qanday parol demo uchun ishlaydi)
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};