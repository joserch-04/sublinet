import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { partners } from '@/data/products';
import { formatPrice, getStatusColor, getStatusLabel } from '@/utils/helpers';
import {
  LayoutDashboard, Users, Package, TrendingUp, DollarSign,
  MapPin, Star, Activity, ChevronRight, AlertCircle,
  CheckCircle2, Clock, Printer, Truck
} from 'lucide-react';

const stats = [
  { label: 'Pedidos hoy', value: '24', change: '+12%', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'Ingresos', value: '$12,450', change: '+8%', icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'Socios activos', value: '4', change: '+1', icon: Users, color: 'bg-brand-50 text-brand-600' },
  { label: 'Tasa de éxito', value: '98.5%', change: '+0.3%', icon: TrendingUp, color: 'bg-accent-violet/10 text-accent-violet' },
];

const recentOrders = [
  { id: 'ORD-2026-024', customer: 'María García', product: 'Taza Cerámica Clásica', status: 'printing', total: 38.97, partner: 'SublimaPro Norte' },
  { id: 'ORD-2026-023', customer: 'Luis Hernández', product: 'Camiseta Premium', status: 'processing', total: 74.97, partner: 'PrintMaster Chinandega' },
  { id: 'ORD-2026-022', customer: 'Ana Torres', product: 'Mousepad XL Gaming', status: 'shipped', total: 39.98, partner: 'ColorVibe Leon' },
  { id: 'ORD-2026-021', customer: 'Pedro Ruiz', product: 'Botella Térmica 500ml', status: 'pending', total: 45.98, partner: 'Sin asignar' },
  { id: 'ORD-2026-020', customer: 'Sofía Martínez', product: 'Puzzle Personalizado', status: 'delivered', total: 21.99, partner: 'SublimArt Managua' },
];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'partners'>('dashboard');

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">Panel de Administración</h1>
            <p className="mt-1 text-ink-500">Gestión interna de SubliNet</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-brand-700">Sistema operativo</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl bg-ink-100 p-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Pedidos', icon: Package },
            { id: 'partners', label: 'Socios', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="mt-6 space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(stat => (
                <div key={stat.label} className="card">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-ink-900">{stat.value}</p>
                  <p className="text-sm text-ink-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink-900">Pedidos recientes</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Ver todos <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-left text-xs font-medium text-ink-400">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Cliente</th>
                      <th className="pb-3 pr-4">Producto</th>
                      <th className="pb-3 pr-4">Estado</th>
                      <th className="pb-3 pr-4">Socio</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-ink-50 last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs text-ink-600">{order.id}</td>
                        <td className="py-3 pr-4 font-medium text-ink-900">{order.customer}</td>
                        <td className="py-3 pr-4 text-ink-600">{order.product}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' && <Clock className="h-3 w-3" />}
                            {order.status === 'processing' && <Activity className="h-3 w-3" />}
                            {order.status === 'printing' && <Printer className="h-3 w-3" />}
                            {order.status === 'shipped' && <Truck className="h-3 w-3" />}
                            {order.status === 'delivered' && <CheckCircle2 className="h-3 w-3" />}
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-ink-600">
                          {order.partner === 'Sin asignar' ? (
                            <span className="flex items-center gap-1 text-amber-600">
                              <AlertCircle className="h-3 w-3" />
                              Sin asignar
                            </span>
                          ) : (
                            order.partner
                          )}
                        </td>
                        <td className="py-3 text-right font-semibold text-ink-900">
                          {formatPrice(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="mt-6 card">
            <h3 className="text-lg font-semibold text-ink-900">Gestión de Pedidos</h3>
            <p className="mt-1 text-sm text-ink-500">Asigna pedidos a socios de sublimación</p>

            <div className="mt-6 space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="rounded-xl border border-ink-100 bg-ink-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-ink-900">{order.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-ink-600">
                        {order.customer} · {order.product} · {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="input-field w-auto py-2 pr-8 text-sm"
                        defaultValue={order.partner === 'Sin asignar' ? '' : order.partner}
                      >
                        <option value="">Asignar socio...</option>
                        {partners.filter(p => p.active).map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.location})</option>
                        ))}
                      </select>
                      <button className="btn-primary py-2 text-xs">
                        Asignar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink-900">Red de Socios SubliNet</h3>
              <span className="text-sm text-ink-500">Solo visible para administradores</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map(partner => (
                <div key={partner.id} className={`card ${!partner.active ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-ink-900">{partner.name}</h4>
                      <div className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {partner.location}
                      </div>
                    </div>
                    <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      partner.active ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-500'
                    }`}>
                      {partner.active ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-ink-700">{partner.rating}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-ink-500">Especialidades</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {partner.specialty.map(s => (
                        <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 capitalize">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-ink-500">Capacidad</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full ${
                          partner.capacity === 'high' ? 'w-full bg-green-500' :
                          partner.capacity === 'medium' ? 'w-2/3 bg-amber-500' :
                          'w-1/3 bg-red-400'
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-ink-400 capitalize">{partner.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
