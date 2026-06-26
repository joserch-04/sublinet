import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { partners as initialPartners } from '@/data/products'; // Aliaseado para evitar colisiones
import { formatPrice, getStatusColor, getStatusLabel } from '@/utils/helpers';
import {
  LayoutDashboard, Users, Package, TrendingUp, DollarSign,
  MapPin, Star, Activity, ChevronRight,
  CheckCircle2, Clock, Printer, Truck, ShoppingCart, Search
} from 'lucide-react';
import type { Order } from '@/types';

interface EnrichedOrder extends Order {
  customerEmail: string;
  customerName: string;
}

interface Partner {
  id: string;
  name: string;
  location: string;
  rating: number;
  active: boolean;
  specialty: string[];
  capacity: 'high' | 'medium' | 'low';
}

const defaultStats = [
  { label: 'Pedidos hoy', value: '0', change: '0%', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'Ingresos', value: '$0', change: '0%', icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'Socios activos', value: '0', change: '+0', icon: Users, color: 'bg-brand-50 text-brand-600' },
  { label: 'Tasa de éxito', value: '100%', change: '0%', icon: TrendingUp, color: 'bg-accent-violet/10 text-accent-violet' },
];

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'partners'>('dashboard');
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del CRUD de Socios
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ═══════════════════════════════════════════════════════
  // PERSISTENCIA Y CARGA DE SOCIOS (LOCALSTORAGE)
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    const storedPartners = localStorage.getItem('sublinet_partners');
    if (!storedPartners) {
      localStorage.setItem('sublinet_partners', JSON.stringify(initialPartners));
      setPartnersList(initialPartners as Partner[]);
    } else {
      setPartnersList(JSON.parse(storedPartners));
    }
  }, []);

  const savePartners = (updatedPartners: Partner[]) => {
    localStorage.setItem('sublinet_partners', JSON.stringify(updatedPartners));
    setPartnersList(updatedPartners);
  };

  // ═══════════════════════════════════════════════════════
  // CARGAR TODOS LOS PEDIDOS DE TODOS LOS USUARIOS
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    const loadAllOrders = () => {
      const allOrders: EnrichedOrder[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith('sublinet_orders_')) {
          const email = key.replace('sublinet_orders_', '');
          const data = localStorage.getItem(key);
          
          if (data) {
            try {
              const userOrders: Order[] = JSON.parse(data);
              const userData = localStorage.getItem(`sublinet_user_${email}`) || 
                               localStorage.getItem('sublinet_user');
              let customerName = email.split('@')[0];
              
              if (userData) {
                try {
                  const parsed = JSON.parse(userData);
                  customerName = parsed.name || customerName;
                } catch {}
              }
              
              userOrders.forEach(order => {
                allOrders.push({
                  ...order,
                  customerEmail: email,
                  customerName: customerName,
                });
              });
            } catch (e) {
              console.warn(`Error parseando pedidos de ${email}:`, e);
            }
          }
        }
      }
      
      allOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(allOrders);
      calculateStats(allOrders);
      setLoading(false);
    };
    
    loadAllOrders();
    
    const interval = setInterval(loadAllOrders, 3000);
    return () => clearInterval(interval);
  }, [partnersList]); // Recalcula si cambia la lista de socios

  const calculateStats = (currentOrders: EnrichedOrder[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = currentOrders.filter(o => o.createdAt === today);
    const totalRevenue = currentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const delivered = currentOrders.filter(o => o.status === 'delivered').length;
    const successRate = currentOrders.length > 0 ? ((delivered / currentOrders.length) * 100).toFixed(1) : '100';
    const activePartnersCount = partnersList.filter(p => p.active).length;
    
    setStats([
      { 
        label: 'Pedidos totales', 
        value: currentOrders.length.toString(), 
        change: `+${todayOrders.length} hoy`, 
        icon: Package, 
        color: 'bg-blue-50 text-blue-600' 
      },
      { 
        label: 'Ingresos totales', 
        value: formatPrice(totalRevenue), 
        change: 'activo', 
        icon: DollarSign, 
        color: 'bg-green-50 text-green-600' 
      },
      { 
        label: 'Socios activos', 
        value: activePartnersCount.toString(), 
        change: 'en red', 
        icon: Users, 
        color: 'bg-brand-50 text-brand-600' 
      },
      { 
        label: 'Tasa de éxito', 
        value: `${successRate}%`, 
        change: `${delivered} entregados`, 
        icon: TrendingUp, 
        color: 'bg-accent-violet/10 text-accent-violet' 
      },
    ]);
  };

  // ═══════════════════════════════════════════════════════
  // MANEJADORES CRUD DE SOCIOS
  // ═══════════════════════════════════════════════════════
  const handleSavePartner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const partnerData: Partner = {
      id: editingPartner?.id || `partner_${Date.now()}`,
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      rating: editingPartner?.rating || 5.0,
      active: formData.get('active') === 'true',
      specialty: (formData.get('specialty') as string).split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      capacity: formData.get('capacity') as 'high' | 'medium' | 'low',
    };

    if (editingPartner?.id) {
      const updated = partnersList.map(p => p.id === editingPartner.id ? partnerData : p);
      savePartners(updated);
    } else {
      savePartners([...partnersList, partnerData]);
    }
    
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este socio de la red?')) {
      const updated = partnersList.filter(p => p.id !== id);
      savePartners(updated);
    }
  };

  // Actualizar estado de pedido
  const updateOrderStatus = (orderId: string, customerEmail: string, newStatus: Order['status']) => {
    const key = `sublinet_orders_${customerEmail}`;
    const data = localStorage.getItem(key);
    
    if (data) {
      try {
        const userOrders: Order[] = JSON.parse(data);
        const updated = userOrders.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem(key, JSON.stringify(updated));
        
        const allOrders = orders.map(o => 
          o.id === orderId && o.customerEmail === customerEmail 
            ? { ...o, status: newStatus } 
            : o
        );
        setOrders(allOrders);
        calculateStats(allOrders);
      } catch (e) {
        console.error('Error actualizando estado:', e);
      }
    }
  };

  // Asignar socio a pedido
  const assignPartner = (orderId: string, customerEmail: string, partnerName: string) => {
    const key = `sublinet_orders_${customerEmail}`;
    const data = localStorage.getItem(key);
    
    if (data) {
      try {
        const userOrders: Order[] = JSON.parse(data);
        const updated = userOrders.map(o => 
          o.id === orderId ? { ...o, partner: partnerName, status: partnerName ? ('processing' as const) : o.status } : o
        );
        localStorage.setItem(key, JSON.stringify(updated));
        
        const allOrders = orders.map(o => 
          o.id === orderId && o.customerEmail === customerEmail 
            ? { ...o, partner: partnerName, status: partnerName ? ('processing' as const) : o.status } 
            : o
        );
        setOrders(allOrders);
        calculateStats(allOrders);
      } catch (e) {
        console.error('Error assigning partner:', e);
      }
    }
  };

  // Filtrar pedidos por búsqueda
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.items.some(i => i.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">Panel de Administración</h1>
            <p className="mt-1 text-ink-500">
              Gestión interna de SubliNet · {orders.length} pedidos · {partnersList.length} socios en red
            </p>
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
            { id: 'orders', label: `Pedidos (${orders.length})`, icon: Package },
            { id: 'partners', label: `Socios (${partnersList.length})`, icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              }`}>
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            TAB: DASHBOARD
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="mt-6 space-y-6">
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

            {/* Pedidos recientes */}
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
                      <th className="pb-3 pr-4">Productos</th>
                      <th className="pb-3 pr-4">Estado</th>
                      <th className="pb-3 pr-4">Entrega est.</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={`${order.id}-${order.customerEmail}`} className="border-b border-ink-50 last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs text-ink-600">{order.id}</td>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-ink-900">{order.customerName}</div>
                          <div className="text-xs text-ink-400">{order.customerEmail}</div>
                        </td>
                        <td className="py-3 pr-4 text-ink-600">{order.items.length} producto(s)</td>
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
                        <td className="py-3 pr-4 text-xs text-ink-500">{order.estimatedDelivery}</td>
                        <td className="py-3 text-right font-semibold text-ink-900">{formatPrice(order.total)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-ink-400">
                          <ShoppingCart className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          No hay pedidos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB: PEDIDOS (GESTIÓN Y ASIGNACIÓN)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink-900">Gestión de Pedidos</h3>
                <p className="mt-1 text-sm text-ink-500">Asigna pedidos a socios activos en la red</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID, cliente o producto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 sm:w-80"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={`${order.id}-${order.customerEmail}`} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    
                    {/* Info del pedido */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-ink-900">{order.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className="text-xs text-ink-400">{order.createdAt}</span>
                        <span className="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                          #{order.trackingNumber}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm font-medium text-ink-900">{order.customerName}</p>
                        <p className="text-xs text-ink-500">{order.customerEmail}</p>
                      </div>

                      {/* Items */}
                      <div className="mt-3 space-y-2">
                        {order.items.map((item, idx) => {
                          // CORRECCIÓN CRÍTICA: Buscar url dentro de images por color, o fallback al primero
                          const itemImage = item.product.images?.find(img => img.color === item.selectedColor)?.url 
                            || item.product.images?.[0]?.url 
                            || '/images/products/placeholder.jpg';

                          return (
                            <div key={idx} className="flex items-center gap-3 rounded-lg bg-ink-50 p-2">
                              <img src={itemImage} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-ink-900">{item.product.name}</p>
                                <p className="text-xs text-ink-500">
                                  Cant: {item.quantity} · {formatPrice(item.product.basePrice)} c/u
                                  {item.selectedColor && ` · Color: ${item.selectedColor}`}
                                  {item.selectedSize && ` · Talla: ${item.selectedSize}`}
                                  {item.designUrl && ' · ✓ Personalizado'}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-ink-900">
                                {formatPrice(item.product.basePrice * item.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-ink-500">
                          Entrega estimada: <span className="font-medium text-ink-700">{order.estimatedDelivery}</span>
                        </span>
                        <span className="text-lg font-bold text-ink-900">Total: {formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Controles Admin */}
                    <div className="flex flex-col gap-3 min-w-[220px]">
                      <div>
                        <label className="text-xs font-medium text-ink-500">Estado del pedido</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, order.customerEmail, e.target.value as Order['status'])}
                          className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                        >
                          <option value="pending">⏳ Pendiente</option>
                          <option value="processing">⚙️ Procesando</option>
                          <option value="printing">🖨️ Imprimiendo</option>
                          <option value="shipped">🚚 Enviado</option>
                          <option value="delivered">✅ Entregado</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-ink-500">Asignar socio</label>
                        <select
                          value={order.partner || ''}
                          onChange={(e) => assignPartner(order.id, order.customerEmail, e.target.value)}
                          className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                        >
                          <option value="">Sin asignar...</option>
                          {partnersList.filter(p => p.active).map(p => (
                            <option key={p.id} value={p.name}>
                              {p.name} ({p.location})
                            </option>
                          ))}
                        </select>
                      </div>

                      {order.partner && (
                        <div className="rounded-lg bg-green-50 p-2 text-center">
                          <span className="text-xs font-medium text-green-700">✓ Asignado a: {order.partner}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB: SOCIOS (CRUD COMPLETO)
        ═══════════════════════════════════════════════════════ */}
        {activeTab === 'partners' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink-900">Red de Socios SubliNet</h3>
                <span className="text-sm text-ink-500">Administración de talleres de sublimación vinculados</span>
              </div>
              <button
                onClick={() => { setEditingPartner(null); setIsModalOpen(true); }}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                + Agregar Socio
              </button>
            </div>

            {/* Grid de Socios */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partnersList.map(partner => (
                <div key={partner.id} className={`card flex flex-col justify-between ${!partner.active ? 'opacity-60' : ''}`}>
                  <div>
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
                        {partner.specialty?.map(s => (
                          <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 capitalize">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-ink-500">Capacidad de producción</p>
                      <div className="mt-1 h-2 w-full rounded-full bg-ink-100">
                        <div
                          className={`h-full rounded-full ${
                            partner.capacity === 'high' ? 'w-full bg-green-500' :
                            partner.capacity === 'medium' ? 'w-2/3 bg-amber-500' : 'w-1/3 bg-red-400'
                          }`}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-ink-400 capitalize">{partner.capacity}</p>
                    </div>
                  </div>

                  {/* Acciones CRUD */}
                  <div className="mt-6 flex gap-2 border-t border-ink-100 pt-4">
                    <button
                      onClick={() => { setEditingPartner(partner); setIsModalOpen(true); }}
                      className="flex-1 rounded-lg border border-ink-200 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Formulario Único (Crear / Editar) */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
                  <h3 className="text-lg font-bold text-ink-900">
                    {editingPartner ? 'Modificar Socio Técnico' : 'Vincular Nuevo Socio'}
                  </h3>
                  <form onSubmit={handleSavePartner} className="mt-4 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-ink-600">Nombre de la Empresa / Taller</label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={editingPartner?.name || ''}
                        className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink-600">Dirección o Región de Cobertura</label>
                      <input
                        type="text"
                        name="location"
                        required
                        defaultValue={editingPartner?.location || ''}
                        className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-ink-600">Líneas de producción (Separar con comas)</label>
                      <input
                        type="text"
                        name="specialty"
                        placeholder="camisetas, tazas, serigrafía, acrílicos"
                        required
                        defaultValue={editingPartner?.specialty?.join(', ') || ''}
                        className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-ink-600">Capacidad de Carga</label>
                        <select
                          name="capacity"
                          defaultValue={editingPartner?.capacity || 'medium'}
                          className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                        >
                          <option value="high">Alta (Pedidos industriales)</option>
                          <option value="medium">Media (Pedidos estándar)</option>
                          <option value="low">Baja (Muestras/Bajo Demanda)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink-600">Estado de Operación</label>
                        <select
                          name="active"
                          defaultValue={editingPartner?.active !== false ? 'true' : 'false'}
                          className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
                        >
                          <option value="true">Activo / Recibe Pedidos</option>
                          <option value="false">Inactivo / En Pausa</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-ink-50">
                      <button
                        type="button"
                        onClick={() => { setIsModalOpen(false); setEditingPartner(null); }}
                        className="rounded-lg bg-ink-100 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}