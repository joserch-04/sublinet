import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package, ArrowLeft, Star, Check, Info, Truck, CheckCircle, Clock, ChevronRight, Palette, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/data/products';
import { formatPrice, getStatusColor, getStatusLabel } from '@/utils/helpers';
import { CreditCard, Landmark, Wallet, BadgeDollarSign } from 'lucide-react';
import type { Order, CartItem } from '@/types';

// ═══════════════════════════════════════════════════════
// COMPONENTE: CARTPAGE (CARRITO DE COMPRAS)
// ═══════════════════════════════════════════════════════
export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#111827]">Tu carrito está vacío</h2>
        <p className="mt-2 text-gray-500">Explora nuestro catálogo y encuentra algo especial</p>
        <Link 
          to="/catalogo" 
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 1000 ? 0 : 99;
  const total = totalPrice + shipping;

  const handleSuccess = () => {
    addOrder(items, total, shipping);
    clearCart();
    navigate('/pedidos');
  };

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Tu carrito</h1>
        <p className="mt-1 text-gray-500">{items.length} artículo(s) en tu carrito</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => {
              // SOLUCIÓN: Buscar la imagen correspondiente al color seleccionado o usar la primera por defecto
              const productImage = item.product.images?.find((img) => img.color === item.selectedColor)?.url 
                || item.product.images?.[0]?.url 
                || '/images/products/placeholder.jpg';

              return (
                <div key={`${item.product.id}-${idx}`} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  {/* Product Preview with Design Overlay */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={productImage}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                    {item.designUrl && item.designPosition && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${item.designPosition.x}%`,
                          top: `${item.designPosition.y}%`,
                          transform: `translate(-50%, -50%) scale(${item.designPosition.scale * 0.4})`,
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

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-[#111827]">{item.product.name}</h3>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Color: {item.selectedColor}
                            {item.selectedSize && ` · Talla: ${item.selectedSize}`}
                          </p>
                          {item.designUrl && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#0F4CFF]/10 px-2 py-0.5 text-xs font-medium text-[#0F4CFF]">
                              <Package className="h-3 w-3" />
                              Con diseño personalizado
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-[#111827]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-[#111827]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold text-[#111827]">
                        {formatPrice(item.product.basePrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="text-lg font-semibold text-[#111827]">Resumen del pedido</h3>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-[#111827]">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className="font-medium text-[#111827]">
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-[#00D084]">¡Envío gratis por compras mayores a C$1000!</p>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#111827]">Total</span>
                  <span className="text-xl font-bold text-[#0F4CFF]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
            >
              Proceder al pago
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Envío seguro · Garantía de calidad · Soporte 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          total={total}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTE: CHECKOUTMODAL (PASARELA DE PAGO)
// ═══════════════════════════════════════════════════════
function CheckoutModal({ total, onClose, onSuccess }: { total: number; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => setStep('success'), 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 text-center animate-slide-up mx-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00D084]/10">
            <Package className="h-8 w-8 text-[#00D084]" />
          </div>
          <h2 className="mt-4 text-xl sm:text-2xl font-bold text-[#111827]">¡Pedido confirmado!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Tu pedido ha sido recibido y está siendo asignado a nuestro equipo de sublimación.
            Recibirás un correo con los detalles de seguimiento.
          </p>
          <button 
            onClick={onSuccess} 
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 text-center mx-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0F4CFF]/20 border-t-[#0F4CFF]" />
          <p className="mt-4 font-medium text-gray-700">Procesando tu pedido...</p>
          <p className="text-sm text-gray-500">Conectando con nuestros socios de sublimación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 animate-slide-up mx-2 sm:mx-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Finalizar compra</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-50">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre completo</label>
              <input required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" placeholder="Jose Gutierrez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input required type="email" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" placeholder="josegut@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dirección</label>
            <input required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" placeholder="Calle, número, Reparto" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Ciudad</label>
            <input required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" placeholder="Leon" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>

          {/* Métodos de pago */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">Método de pago</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${formData.paymentMethod === 'card' ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md' : 'border-gray-200 hover:border-[#0F4CFF]/30'}`}
              >
                <div className="rounded-lg sm:rounded-xl bg-[#0F4CFF]/10 p-1.5 sm:p-2">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F4CFF]" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">Tarjeta</p>
                  <p className="hidden sm:block text-xs text-gray-500">Visa / Mastercard</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${formData.paymentMethod === 'bank' ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md' : 'border-gray-200 hover:border-[#0F4CFF]/30'}`}
              >
                <div className="rounded-lg sm:rounded-xl bg-[#00D084]/10 p-1.5 sm:p-2">
                  <Landmark className="h-4 w-4 sm:h-5 sm:w-5 text-[#00D084]" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">Transferencia</p>
                  <p className="hidden sm:block text-xs text-gray-500">Banco nacional</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${formData.paymentMethod === 'paypal' ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md' : 'border-gray-200 hover:border-[#0F4CFF]/30'}`}
              >
                <div className="rounded-lg sm:rounded-xl bg-blue-100 p-1.5 sm:p-2">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">PayPal</p>
                  <p className="hidden sm:block text-xs text-gray-500">Pago seguro online</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${formData.paymentMethod === 'cash' ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md' : 'border-gray-200 hover:border-[#0F4CFF]/30'}`}
              >
                <div className="rounded-lg sm:rounded-xl bg-yellow-100 p-1.5 sm:p-2">
                  <BadgeDollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">Contra entrega</p>
                  <p className="hidden sm:block text-xs text-gray-500">Efectivo al recibir</p>
                </div>
              </button>
            </div>
          </div>

          {/* Detalles Dinámicos del Pago */}
          <div className="mt-4">
            {formData.paymentMethod === 'card' && (
              <div className="space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-[#0F4CFF]/20 bg-[#0F4CFF]/5 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-[#111827]">Información de tarjeta</h3>
                <input type="text" placeholder="Número de tarjeta" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" />
                  <input type="text" placeholder="CVV" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" />
                </div>
              </div>
            )}

            {formData.paymentMethod === 'bank' && (
              <div className="rounded-xl sm:rounded-2xl border border-[#00D084]/20 bg-[#00D084]/5 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-[#111827]">Transferencia bancaria</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p><span className="font-semibold">Banco:</span> BAC</p>
                  <p><span className="font-semibold">Cuenta:</span> 123456789</p>
                  <p><span className="font-semibold">Titular:</span> SubliNet Nicaragua</p>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'paypal' && (
              <div className="rounded-xl sm:rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5 text-center">
                <p className="text-sm font-medium text-gray-700">Serás redirigido a PayPal para completar el pago.</p>
                <button type="button" className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 sm:py-3 text-sm font-bold text-white transition-all hover:scale-105">Continuar con PayPal</button>
              </div>
            )}

            {formData.paymentMethod === 'cash' && (
              <div className="rounded-xl sm:rounded-2xl border border-yellow-200 bg-yellow-50 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-[#111827]">Pago contra entrega</h3>
                <p className="mt-2 text-sm text-gray-600">Pagarás en efectivo al recibir tu pedido.</p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total a pagar</span>
              <span className="font-bold text-[#111827]">{formatPrice(total)}</span>
            </div>
          </div>

          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95">
            Confirmar pedido · {formatPrice(total)}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTE: PRODUCTDETAILPAGE (DETALLE DEL PRODUCTO)
// ═══════════════════════════════════════════════════════
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const product = products.find(p => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [designPosition, setDesignPosition] = useState<{ x: number; y: number; scale: number } | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#111827]">Producto no encontrado</h2>
        <button onClick={() => navigate('/catalogo')} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95">Volver al catálogo</button>
      </div>
    );
  }

  const handleDesignUpload = (url: string | null, position?: { x: number; y: number; scale: number }) => {
    setDesignUrl(url);
    if (position) setDesignPosition(position);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/producto/${product.id}` } });
      return;
    }
    addItem(product, designUrl, selectedColor, selectedSize || undefined, designPosition);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/catalogo')} className="mb-6 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#0F4CFF]">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </button>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-gray-50">
            <img src={product.images.find((img) => img.color === selectedColor)?.url || product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">({product.reviews} reseñas)</span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827]">{product.name}</h1>
            <p className="mt-3 text-lg font-bold text-[#0F4CFF]">{formatPrice(product.basePrice)}</p>
            <p className="mt-4 leading-relaxed text-gray-600">{product.description}</p>

            <div className="mt-6">
              <label className="text-sm font-semibold text-[#111827]">Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${selectedColor === color ? 'border-[#0F4CFF] bg-[#0F4CFF]/10 text-[#0F4CFF]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>{color}</button>
                ))}
              </div>
            </div>

            {product.sizes && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-[#111827]">Talla</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all ${selectedSize === size ? 'border-[#0F4CFF] bg-[#0F4CFF]/10 text-[#0F4CFF]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm font-semibold text-[#111827]">Tu diseño</label>
              <div className="mt-2">
                <DesignUploader onDesignUpload={handleDesignUpload} previewProduct={product.images.find((img) => img.color === selectedColor)?.url || product.images[0].url} />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-500 transition-colors hover:text-[#111827]"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-gray-500 transition-colors hover:text-[#111827]"><Plus className="h-4 w-4" /></button>
              </div>

              <button onClick={handleAddToCart} disabled={added} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 ${added ? 'bg-[#00D084] shadow-[#00D084]/25 hover:bg-[#00b873]' : 'bg-[#0F4CFF] shadow-[#0F4CFF]/25 hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40'}`}>
                {added ? <><Check className="h-4 w-4" /> Agregado</> : !user ? <><LogIn className="h-4 w-4" /> Iniciar sesión</> : <><ShoppingCart className="h-4 w-4" /> Agregar al carrito</>}
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4CFF]" />
                <p className="text-xs leading-relaxed text-gray-500">Tu diseño será revisado por nuestro equipo de calidad antes de la impresión. El tiempo de producción es de 24-48 horas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTE: ORDERSPAGE (HISTORIAL DE PEDIDOS CLIENTE)
// ═══════════════════════════════════════════════════════
const statusSteps = [
  { status: 'pending', label: 'Pedido recibido', icon: Clock },
  { status: 'processing', label: 'En preparación', icon: Package },
  { status: 'printing', label: 'Sublimando', icon: Package },
  { status: 'shipped', label: 'En camino', icon: Truck },
  { status: 'delivered', label: 'Entregado', icon: CheckCircle },
];

export function OrdersPage() {
  const { user } = useAuth();
  const { orders: realOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <LogIn className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-[#111827]">Inicia sesión para ver tus pedidos</h2>
        <p className="mt-2 text-gray-500">Debes estar autenticado para acceder a tu historial</p>
        <Link to="/login" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] active:scale-95">Iniciar sesión</Link>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <Package className="h-16 w-16 text-[#0F4CFF]" />
        <h2 className="mt-4 text-2xl font-bold text-[#111827]">Panel de Administración</h2>
        <p className="mt-2 text-gray-500">Usa el panel general exclusivo para gestionar la producción de pedidos.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Mis pedidos</h1>
        <p className="mt-1 text-gray-500">Hola {user.name}, aquí está tu historial de compras</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            {realOrders.map(order => (
              <button key={order.id} onClick={() => setSelectedOrder(order)} className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedOrder?.id === order.id ? 'border-[#0F4CFF] bg-[#0F4CFF]/5' : 'border-transparent bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-md'}`}>
                <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#111827]">{order.id}</span><ChevronRight className="h-4 w-4 text-gray-400" /></div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                  <span className="text-sm font-semibold text-[#111827]">{formatPrice(order.total)}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#111827]">{selectedOrder.id}</h2>
                    <p className="text-sm text-gray-500">Realizado el {new Date(selectedOrder.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>{getStatusLabel(selectedOrder.status)}</span>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 rounded-xl border border-gray-100 p-3">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img src={item.product.images?.find((img) => img.color === item.selectedColor)?.url || item.product.images?.[0]?.url} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="text-sm font-semibold text-[#111827]">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">Color: {item.selectedColor} {item.selectedSize && `· Talla: ${item.selectedSize}`}</p>
                        <div className="mt-1 flex items-center gap-2">
                          {item.designUrl && <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4CFF]/10 px-2 py-0.5 text-xs font-medium text-[#0F4CFF]"><Palette className="h-3 w-3" /> Personalizado</span>}
                          <span className="text-xs text-gray-400">x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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