import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, User, Menu, X, Store, LogOut, Bell } from 'lucide-react';

interface HeaderProps {
  cartItemsCount?: number;
  onCartClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemsCount = 0, onCartClick }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">WD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WEB DUNYOSI
              </h1>
              <p className="text-xs text-gray-600">E-commerce Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-2xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full ml-2">
                      {user.role === 'admin' ? 'Admin' : 'Mijoz'}
                    </span>
                  </div>
                </div>
                
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-50">
                  <Bell className="h-5 w-5" />
                </button>

                {user.role === 'customer' && onCartClick && (
                  <button
                    onClick={onCartClick}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-50"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                )}
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Chiqish</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white/90 backdrop-blur-sm rounded-b-2xl">
            {user && (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">{user.name}</span>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full ml-2">
                      {user.role === 'admin' ? 'Admin' : 'Mijoz'}
                    </span>
                  </div>
                </div>
                
                {user.role === 'customer' && onCartClick && (
                  <button
                    onClick={() => {
                      onCartClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-2xl hover:bg-gray-50"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Savat ({cartItemsCount})</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors px-4 py-2 rounded-2xl hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Chiqish</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};