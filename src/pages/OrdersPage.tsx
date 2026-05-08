import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, Palette, LogIn } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, getStatusColor, getStatusLabel } from '@/utils/helpers';
import type { Order, CartItem } from '@/types';

// ─── Datos demo SOLO para admin o usuarios sin pedidos ───
const demoItems: CartItem[] = [
  {
    product: {
      id: 'prod-1',
      name: 'Taza Mágica 11oz',
      description: 'Taza que revela tu diseño con calor',
      basePrice: 299,
      image: '/images/products/taza-magica.jpg',
      colors: ['Blanco', 'Negro'],
      category: 'tazas',
      popular: true,
      rating: 4.8,
      reviews: 124,
    },
    quantity: 2,
    designUrl: '/images/designs/logo-demo.png',
    selectedColor: 'Blanco',
    designPosition: { x: 50, y: 45, scale: 1.2 },
  },
  {
    product: {
      id: 'prod-2',
      name: 'Playera Premium Algodón',
      description: 'Playera 100% algodón peinado',
      basePrice: 349,
      image: '/images/products/playera.jpg',
      colors: ['Blanco', 'Negro', 'Azul'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'ropa',
      popular: true,
      rating: 4.9,
      reviews: 89,
    },
    quantity: 1,
    designUrl: '/images/designs/arte-demo.png',
    selectedColor: 'Negro',
    selectedSize: 'L',
    designPosition: { x: 50, y: 35, scale: 0.8 },
  },
];

const demoOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    items: [demoItems[0]],
    status: 'printing',
    total: 598,
    createdAt: '2026-05-05',
    estimatedDelivery: '2026-05-10',
    trackingNumber: 'SUB789456123',
  },
  {
    id: 'ORD-2026-002',
    items: [...demoItems],
    status: 'shipped',
    total: 947,
    createdAt: '2026-04-28',
    estimatedDelivery: '2026-05-03',
    trackingNumber: 'SUB123456789',
  },
];

const statusSteps = [
  { status: 'pending', label: 'Pedido recibido', icon: Clock },
  { status: 'processing', label: 'En preparación', icon: Package },
  { status: 'printing', label: 'Sublimando', icon: Package },
  { status: 'shipped', label: 'En camino', icon: Truck },
  { status: 'delivered', label: 'Entregado', icon: CheckCircle },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders: realOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ─── Sin usuario autenticado ───
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <LogIn className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-[#111827]">Inicia sesión para ver tus pedidos</h2>
        <p className="mt-2 text-gray-500">Debes estar autenticado para acceder a tu historial</p>
        <Link 
          to="/login" 
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  // ─── Admin: mostrar mensaje especial o panel de todos los pedidos ───
  if (user.role === 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <Package className="h-16 w-16 text-[#0F4CFF]" />
        <h2 className="mt-4 text-2xl font-bold text-[#111827]">Panel de Administración</h2>
        <p className="mt-2 text-gray-500">Desde aquí podrás gestionar todos los pedidos de los clientes</p>
        <div className="mt-6 rounded-xl bg-gray-50 p-6 max-w-md">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-[#111827]">Funciones próximas:</span>
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li>• Ver todos los pedidos pendientes</li>
            <li>• Actualizar estado de envíos</li>
            <li>• Gestionar inventario de productos</li>
            <li>• Ver estadísticas de ventas</li>
          </ul>
        </div>
      </div>
    );
  }

  // ─── Cliente: mostrar sus pedidos reales o demo si no tiene ───
  const allOrders = realOrders.length > 0 ? realOrders : demoOrders;

  if (allOrders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-[#111827]">Aún no tienes pedidos</h2>
        <p className="mt-2 text-gray-500">Cuando hagas tu primera compra, aparecerá aquí</p>
        <Link 
          to="/catalogo" 
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Mis pedidos</h1>
        <p className="mt-1 text-gray-500">Hola {user.name}, aquí está tu historial de compras</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* ─── Orders List ─── */}
          <div className="space-y-3 lg:col-span-1">
            {allOrders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  selectedOrder?.id === order.id
                    ? 'border-[#0F4CFF] bg-[#0F4CFF]/5'
                    : 'border-transparent bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111827]">{order.id}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-sm font-semibold text-[#111827]">{formatPrice(order.total)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </button>
            ))}
          </div>

          {/* ─── Order Detail ─── */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#111827]">{selectedOrder.id}</h2>
                    <p className="text-sm text-gray-500">
                      Realizado el {new Date(selectedOrder.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* ─── Products List with Design Preview ─── */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-[#111827]">Productos</h3>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 rounded-xl border border-gray-100 p-3">
                      {/* Product Preview with Design Overlay */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                        {item.designUrl && item.designPosition && (
                          <div
                            className="absolute pointer-events-none"
                            style={{
                              left: `${item.designPosition.x}%`,
                              top: `${item.designPosition.y}%`,
                              transform: `translate(-50%, -50%) scale(${item.designPosition.scale * 0.35})`,
                            }}
                          >
                            <img
                              src={item.designUrl}
                              alt="Diseño"
                              className="h-[150px] w-[150px] object-contain rounded-sm"
                            />
                          </div>
                        )}
                        {item.designUrl && !item.designPosition && (
                          <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-[#0F4CFF] border-2 border-white" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="text-sm font-semibold text-[#111827]">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">
                          Color: {item.selectedColor}
                          {item.selectedSize && ` · Talla: ${item.selectedSize}`}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {item.designUrl && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4CFF]/10 px-2 py-0.5 text-xs font-medium text-[#0F4CFF]">
                              <Palette className="h-3 w-3" />
                              Personalizado
                            </span>
                          )}
                          <span className="text-xs text-gray-400">x{item.quantity}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-[#0F4CFF]">
                          {formatPrice(item.product.basePrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking */}
                {selectedOrder.trackingNumber && (
                  <div className="mt-6 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">Número de guía</p>
                    <p className="mt-1 font-mono text-sm text-[#0F4CFF]">{selectedOrder.trackingNumber}</p>
                  </div>
                )}

                {/* Progress */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[#111827]">Estado del envío</h3>
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute left-0 top-4 h-1 w-full rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#0F4CFF] transition-all"
                          style={{
                            width: `${((statusSteps.findIndex(s => s.status === selectedOrder.status) + 1) / statusSteps.length) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="relative flex justify-between">
                        {statusSteps.map((step, idx) => {
                          const currentIdx = statusSteps.findIndex(s => s.status === selectedOrder.status);
                          const isCompleted = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div key={step.status} className="flex flex-col items-center">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                                  isCompleted
                                    ? 'border-[#0F4CFF] bg-[#0F4CFF] text-white'
                                    : isCurrent
                                    ? 'border-[#0F4CFF] bg-white text-[#0F4CFF]'
                                    : 'border-gray-200 bg-white text-gray-300'
                                }`}
                              >
                                <step.icon className="h-4 w-4" />
                              </div>
                              <span className={`mt-2 text-xs font-medium ${isCompleted || isCurrent ? 'text-gray-700' : 'text-gray-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery estimate */}
                <div className="mt-6 rounded-xl border border-[#00D084]/20 bg-[#00D084]/5 p-4">
                  <p className="text-sm text-[#00D084]">
                    <span className="font-semibold">Entrega estimada:</span>{' '}
                    {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                  </p>
                </div>

                {/* Total */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#111827]">Total del pedido</span>
                    <span className="text-xl font-bold text-[#0F4CFF]">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <Package className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">Selecciona un pedido para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}