import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'admin' | 'customer') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error parsing currentUser from localStorage:', e);
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const defaultAdmins: User[] = [
        {
          id: '1',
          email: 'admin@example.com',
          name: 'John Smith',
          role: 'admin',
          phone: '+1 (555) 123-4567',
          address: '123 Admin Street, New York, NY 10001',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'sarah.admin@example.com',
          name: 'Sarah Johnson',
          role: 'admin',
          phone: '+1 (555) 234-5678',
          address: '456 Management Ave, Los Angeles, CA 90210',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'mike.admin@example.com',
          name: 'Mike Wilson',
          role: 'admin',
          phone: '+1 (555) 345-6789',
          address: '789 Executive Blvd, Chicago, IL 60601',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          email: 'emma.admin@example.com',
          name: 'Emma Davis',
          role: 'admin',
          phone: '+1 (555) 456-7890',
          address: '321 Director Lane, Miami, FL 33101',
          createdAt: new Date().toISOString(),
        }
      ];

      let updated = false;
      const updatedUsers = [...users];
      defaultAdmins.forEach(admin => {
        if (!updatedUsers.some(u => u.email === admin.email)) {
          updatedUsers.push(admin);
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error('Error initializing default admins in localStorage:', e);
    }

    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      if (products.length === 0) {
        const sampleProducts = [
          {
            id: '1',
            name: 'Premium Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
            price: 299.99,
            category: 'electronics',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 25,
            createdBy: '1',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Smart Fitness Watch',
            description: 'Advanced fitness tracker with heart rate monitoring, GPS, and waterproof design. Track your health 24/7.',
            price: 199.99,
            category: 'electronics',
            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 40,
            createdBy: '2',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Designer Cotton T-Shirt',
            description: 'Premium 100% organic cotton t-shirt with modern fit. Available in multiple colors and sizes.',
            price: 49.99,
            category: 'clothing',
            image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 100,
            createdBy: '1',
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Leather Crossbody Bag',
            description: 'Handcrafted genuine leather crossbody bag with multiple compartments. Perfect for daily use and travel.',
            price: 129.99,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 30,
            createdBy: '3',
            createdAt: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Wireless Bluetooth Speaker',
            description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life.',
            price: 89.99,
            category: 'electronics',
            image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 50,
            createdBy: '4',
            createdAt: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Yoga Mat Pro',
            description: 'Professional-grade yoga mat with superior grip and cushioning. Eco-friendly and non-slip surface.',
            price: 79.99,
            category: 'sports',
            image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 35,
            createdBy: '2',
            createdAt: new Date().toISOString()
          },
          {
            id: '7',
            name: 'Ceramic Coffee Mug Set',
            description: 'Set of 4 handcrafted ceramic coffee mugs with unique designs. Microwave and dishwasher safe.',
            price: 39.99,
            category: 'home',
            image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 60,
            createdBy: '1',
            createdAt: new Date().toISOString()
          },
          {
            id: '8',
            name: 'Denim Jacket Classic',
            description: 'Timeless denim jacket with vintage wash and modern fit. A wardrobe essential for any season.',
            price: 89.99,
            category: 'clothing',
            image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 45,
            createdBy: '3',
            createdAt: new Date().toISOString()
          },
          {
            id: '9',
            name: 'Stainless Steel Water Bottle',
            description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
            price: 29.99,
            category: 'sports',
            image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 80,
            createdBy: '4',
            createdAt: new Date().toISOString()
          },
          {
            id: '10',
            name: 'Wireless Phone Charger',
            description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
            price: 34.99,
            category: 'electronics',
            image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 70,
            createdBy: '2',
            createdAt: new Date().toISOString()
          },
          {
            id: '11',
            name: 'Sunglasses Aviator Style',
            description: 'Classic aviator sunglasses with UV protection and polarized lenses. Timeless style meets modern protection.',
            price: 119.99,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 25,
            createdBy: '1',
            createdAt: new Date().toISOString()
          },
          {
            id: '12',
            name: 'Indoor Plant Pot Set',
            description: 'Set of 3 modern ceramic plant pots with drainage holes. Perfect for herbs, succulents, and small plants.',
            price: 54.99,
            category: 'home',
            image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 40,
            createdBy: '3',
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
      }
    } catch (e) {
      console.error('Error initializing sample products in localStorage:', e);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
    } catch (e) {
      console.error('Login failed:', e);
    }
    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'admin' | 'customer'): Promise<boolean> => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find(u => u.email === email)) {
        return false; // User already exists
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    } catch (e) {
      console.error('Registration failed:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('currentUser');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update in users array
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (e) {
      console.error('Update profile failed:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};