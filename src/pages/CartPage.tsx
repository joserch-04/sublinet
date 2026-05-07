import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/helpers';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100">
          <ShoppingBag className="h-10 w-10 text-ink-300" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-ink-900">Tu carrito está vacío</h2>
        <p className="mt-2 text-ink-500">Explora nuestro catálogo y encuentra algo especial</p>
        <Link to="/catalogo" className="btn-primary mt-6">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 500 ? 0 : 99;
  const total = totalPrice + shipping;

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Tu carrito</h1>
        <p className="mt-1 text-ink-500">{items.length} artículo(s) en tu carrito</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="card flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-ink-900">{item.product.name}</h3>
                        <p className="mt-0.5 text-xs text-ink-500">
                          Color: {item.selectedColor}
                          {item.selectedSize && ` · Talla: ${item.selectedSize}`}
                        </p>
                        {item.designUrl && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                            <Package className="h-3 w-3" />
                            Con diseño personalizado
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-ink-200 bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-ink-500 hover:text-ink-900"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-ink-500 hover:text-ink-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold text-ink-900">
                      {formatPrice(item.product.basePrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100">
            <h3 className="text-lg font-semibold text-ink-900">Resumen del pedido</h3>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Subtotal</span>
                <span className="font-medium text-ink-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Envío</span>
                <span className="font-medium text-ink-900">
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-600">¡Envío gratis por compras mayores a $500!</p>
              )}
              <div className="border-t border-ink-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-ink-900">Total</span>
                  <span className="text-xl font-bold text-ink-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="btn-primary mt-6 w-full"
            >
              Proceder al pago
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-xs text-ink-400">
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
          onSuccess={() => {
            clearCart();
            navigate('/pedidos');
          }}
        />
      )}
    </div>
  );
}

function CheckoutModal({ total, onClose, onSuccess }: { total: number; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', zip: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => setStep('success'), 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center animate-slide-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-ink-900">¡Pedido confirmado!</h2>
          <p className="mt-2 text-sm text-ink-500">
            Tu pedido ha sido recibido y está siendo asignado a nuestro equipo de sublimación.
            Recibirás un correo con los detalles de seguimiento.
          </p>
          <button onClick={onSuccess} className="btn-primary mt-6 w-full">
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="mt-4 font-medium text-ink-700">Procesando tu pedido...</p>
          <p className="text-sm text-ink-500">Conectando con nuestros socios de sublimación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">Finalizar compra</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-400 hover:bg-ink-50">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">Nombre completo</label>
              <input required className="input-field" placeholder="Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">Correo electrónico</label>
              <input required type="email" className="input-field" placeholder="juan@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Dirección</label>
            <input required className="input-field" placeholder="Calle, número, colonia" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">Ciudad</label>
              <input required className="input-field" placeholder="Ciudad de México" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">Código postal</label>
              <input required className="input-field" placeholder="01000" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
            </div>
          </div>

          <div className="rounded-xl bg-ink-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Total a pagar</span>
              <span className="font-bold text-ink-900">{formatPrice(total)}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Confirmar pedido · {formatPrice(total)}
          </button>
        </form>
      </div>
    </div>
  );
}
