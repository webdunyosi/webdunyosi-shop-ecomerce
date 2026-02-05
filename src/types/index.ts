export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdBy: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}