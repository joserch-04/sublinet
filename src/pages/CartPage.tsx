import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { formatPrice } from '@/utils/helpers';
import {
  CreditCard,
  Landmark,
  Wallet,
  BadgeDollarSign,
} from 'lucide-react';

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

  const shipping = totalPrice > 500 ? 0 : 99;
  const total = totalPrice + shipping;

  const handleSuccess = () => {
    // GUARDAR EL PEDIDO ANTES DE LIMPIAR EL CARRITO
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
            {items.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                {/* Product Preview with Design Overlay */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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
            ))}

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
                <p className="text-xs text-[#00D084]">¡Envío gratis por compras mayores a $500!</p>
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

// ... (todo el código anterior igual hasta el CheckoutModal)

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
      {/* CORRECCIÓN 1: w-full + max-w-lg + max-h-[90vh] + overflow-y-auto */}
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ciudad</label>
              <input required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" placeholder="Leon" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            {/* CORRECCIÓN 2: Agregué el campo ZIP que faltaba */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Código postal</label>
              <input required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20" placeholder="21000" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
            </div>
          </div>

          {/* Métodos de pago */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Método de pago
            </label>

            {/* CORRECCIÓN 3: grid-cols-2 en móvil, sm:grid-cols-2 se mantiene */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">

              {/* Tarjeta */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: 'card' })
                }
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#0F4CFF]/30'
                }`}
              >
                <div className="rounded-lg sm:rounded-xl bg-[#0F4CFF]/10 p-1.5 sm:p-2">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F4CFF]" />
                </div>

                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">
                    Tarjeta
                  </p>

                  <p className="hidden sm:block text-xs text-gray-500">
                    Visa / Mastercard
                  </p>
                </div>
              </button>

              {/* Transferencia */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: 'bank' })
                }
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${
                  formData.paymentMethod === 'bank'
                    ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#0F4CFF]/30'
                }`}
              >
                <div className="rounded-lg sm:rounded-xl bg-[#00D084]/10 p-1.5 sm:p-2">
                  <Landmark className="h-4 w-4 sm:h-5 sm:w-5 text-[#00D084]" />
                </div>

                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">
                    Transferencia
                  </p>

                  <p className="hidden sm:block text-xs text-gray-500">
                    Banco nacional
                  </p>
                </div>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: 'paypal' })
                }
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${
                  formData.paymentMethod === 'paypal'
                    ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#0F4CFF]/30'
                }`}
              >
                <div className="rounded-lg sm:rounded-xl bg-blue-100 p-1.5 sm:p-2">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>

                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">
                    PayPal
                  </p>

                  <p className="hidden sm:block text-xs text-gray-500">
                    Pago seguro online
                  </p>
                </div>
              </button>

              {/* Efectivo */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: 'cash' })
                }
                className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'border-[#0F4CFF] bg-[#0F4CFF]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#0F4CFF]/30'
                }`}
              >
                <div className="rounded-lg sm:rounded-xl bg-yellow-100 p-1.5 sm:p-2">
                  <BadgeDollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>

                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827]">
                    Contra entrega
                  </p>

                  <p className="hidden sm:block text-xs text-gray-500">
                    Efectivo al recibir
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* CONTENIDO DINÁMICO SEGÚN MÉTODO */}
          <div className="mt-4">

            {/* TARJETA */}
            {formData.paymentMethod === 'card' && (
              <div className="space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-[#0F4CFF]/20 bg-[#0F4CFF]/5 p-4 sm:p-5">

                <h3 className="text-sm font-bold text-[#111827]">
                  Información de tarjeta
                </h3>

                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
                />

                {/* CORRECCIÓN 4: grid-cols-1 en móvil, sm:grid-cols-2 en desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
                  />

                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
                  />
                </div>
              </div>
            )}

            {/* TRANSFERENCIA */}
            {formData.paymentMethod === 'bank' && (
              <div className="rounded-xl sm:rounded-2xl border border-[#00D084]/20 bg-[#00D084]/5 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-[#111827]">
                  Transferencia bancaria
                </h3>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p><span className="font-semibold">Banco:</span> BAC</p>
                  <p><span className="font-semibold">Cuenta:</span> 123456789</p>
                  <p><span className="font-semibold">Titular:</span> SubliNet Nicaragua</p>
                </div>
              </div>
            )}

            {/* PAYPAL */}
            {formData.paymentMethod === 'paypal' && (
              <div className="rounded-xl sm:rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5 text-center">
                <p className="text-sm font-medium text-gray-700">
                  Serás redirigido a PayPal para completar el pago.
                </p>

                <button
                  type="button"
                  className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 sm:py-3 text-sm font-bold text-white transition-all hover:scale-105"
                >
                  Continuar con PayPal
                </button>
              </div>
            )}

            {/* EFECTIVO */}
            {formData.paymentMethod === 'cash' && (
              <div className="rounded-xl sm:rounded-2xl border border-yellow-200 bg-yellow-50 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-[#111827]">
                  Pago contra entrega
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Pagarás en efectivo al recibir tu pedido.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total a pagar</span>
              <span className="font-bold text-[#111827]">{formatPrice(total)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
          >
            Confirmar pedido · {formatPrice(total)}
          </button>
        </form>
      </div>
    </div>
  );
}