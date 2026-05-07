import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatPrice, getStatusColor, getStatusLabel } from '@/utils/helpers';
import type { Order } from '@/types';

const demoOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    items: [],
    status: 'printing',
    total: 64.97,
    createdAt: '2026-05-05',
    estimatedDelivery: '2026-05-10',
    trackingNumber: 'SUB789456123',
  },
  {
    id: 'ORD-2026-002',
    items: [],
    status: 'shipped',
    total: 129.95,
    createdAt: '2026-04-28',
    estimatedDelivery: '2026-05-03',
    trackingNumber: 'SUB123456789',
  },
  {
    id: 'ORD-2025-089',
    items: [],
    status: 'delivered',
    total: 45.98,
    createdAt: '2025-12-15',
    estimatedDelivery: '2025-12-20',
    trackingNumber: 'SUB456789123',
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (demoOrders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-ink-300" />
        <h2 className="mt-4 text-2xl font-bold text-ink-900">Aún no tienes pedidos</h2>
        <p className="mt-2 text-ink-500">Cuando hagas tu primera compra, aparecerá aquí</p>
        <Link to="/catalogo" className="btn-primary mt-6">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Mis pedidos</h1>
        <p className="mt-1 text-ink-500">Seguimiento de todos tus pedidos SubliNet</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Orders List */}
          <div className="space-y-3 lg:col-span-1">
            {demoOrders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  selectedOrder?.id === order.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-transparent bg-white shadow-sm ring-1 ring-ink-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-900">{order.id}</span>
                  <ChevronRight className="h-4 w-4 text-ink-400" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-sm font-semibold text-ink-900">{formatPrice(order.total)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-400">
                  {new Date(order.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </button>
            ))}
          </div>

          {/* Order Detail */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-ink-900">{selectedOrder.id}</h2>
                    <p className="text-sm text-ink-500">
                      Realizado el {new Date(selectedOrder.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* Tracking */}
                {selectedOrder.trackingNumber && (
                  <div className="mt-4 rounded-xl bg-ink-50 p-4">
                    <p className="text-sm font-medium text-ink-700">Número de guía</p>
                    <p className="mt-1 font-mono text-sm text-brand-600">{selectedOrder.trackingNumber}</p>
                  </div>
                )}

                {/* Progress */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-ink-900">Estado del envío</h3>
                  <div className="mt-4">
                    <div className="relative">
                      {/* Progress bar */}
                      <div className="absolute left-0 top-4 h-1 w-full rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{
                            width: `${((statusSteps.findIndex(s => s.status === selectedOrder.status) + 1) / statusSteps.length) * 100}%`,
                          }}
                        />
                      </div>
                      {/* Steps */}
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
                                    ? 'border-brand-500 bg-brand-500 text-white'
                                    : isCurrent
                                    ? 'border-brand-500 bg-white text-brand-500'
                                    : 'border-ink-200 bg-white text-ink-300'
                                }`}
                              >
                                <step.icon className="h-4 w-4" />
                              </div>
                              <span className={`mt-2 text-xs font-medium ${isCompleted || isCurrent ? 'text-ink-700' : 'text-ink-400'}`}>
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
                <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-4">
                  <p className="text-sm text-brand-800">
                    <span className="font-semibold">Entrega estimada:</span>{' '}
                    {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                  </p>
                </div>

                {/* Total */}
                <div className="mt-6 border-t border-ink-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-ink-900">Total del pedido</span>
                    <span className="text-xl font-bold text-ink-900">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100">
                <Package className="h-12 w-12 text-ink-300" />
                <p className="mt-4 text-ink-500">Selecciona un pedido para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
