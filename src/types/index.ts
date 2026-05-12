export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  colors: string[];
  sizes?: string[];
  rating: number;
  reviews: number;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  designUrl: string | null;
  selectedColor: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export interface Partner {
  id: string;
  name: string;
  specialty: string[];
  capacity: 'low' | 'medium' | 'high';
  rating: number;
  location: string;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
}

export interface DesignPosition {
  x: number;
  y: number;
  scale: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  designUrl: string | null;
  selectedColor: string;
  selectedSize?: string;
  designPosition?: DesignPosition;
}

export type OrderStatus = Order['status'];
