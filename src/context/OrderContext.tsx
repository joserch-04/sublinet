import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { CartItem, Order } from '@/types';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, shipping: number) => Order;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // Cargar pedidos del usuario actual al iniciar o cambiar de usuario
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`sublinet_orders_${user.email}`);
      setOrders(saved ? JSON.parse(saved) : []);
    } else {
      setOrders([]); // Sin usuario = sin pedidos
    }
  }, [user]);

  // Guardar en localStorage cuando cambian los pedidos
  useEffect(() => {
    if (user) {
      localStorage.setItem(`sublinet_orders_${user.email}`, JSON.stringify(orders));
    }
  }, [orders, user]);

  const addOrder = useCallback((items: CartItem[], total: number) => {
    if (!user) throw new Error('Debes iniciar sesión para crear un pedido');

    const now = new Date();
    const delivery = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    
    const newOrder: Order = {
      id: `ORD-${now.getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      items: items.map(item => ({
        ...item,
        designPosition: item.designPosition ? { ...item.designPosition } : undefined
      })),
      status: 'pending',
      total,
      createdAt: now.toISOString().split('T')[0],
      estimatedDelivery: delivery.toISOString().split('T')[0],
      trackingNumber: `SUB${Math.floor(Math.random() * 900000000 + 100000000)}`,
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, [user, orders.length]);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}