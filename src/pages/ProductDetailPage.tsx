import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Check, Info } from 'lucide-react';
import DesignUploader from '@/components/DesignUploader';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/helpers';

export default function ProductDetailPage() {
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
        <button 
          onClick={() => navigate('/catalogo')} 
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleDesignUpload = (url: string | null, position?: { x: number; y: number; scale: number }) => {
    setDesignUrl(url);
    if (position) {
      setDesignPosition(position);
    }
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
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/catalogo')}
          className="mb-6 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[#0F4CFF]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </button>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
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

            {/* Color Selection */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-[#111827]">Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-[#0F4CFF] bg-[#0F4CFF]/10 text-[#0F4CFF]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-[#111827]">Talla</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-[#0F4CFF] bg-[#0F4CFF]/10 text-[#0F4CFF]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Design Upload */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-[#111827]">Tu diseño</label>
              <div className="mt-2">
                <DesignUploader onDesignUpload={handleDesignUpload} previewProduct={product.image} />
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-500 transition-colors hover:text-[#111827]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-500 transition-colors hover:text-[#111827]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 ${
                  added 
                    ? 'bg-[#00D084] shadow-[#00D084]/25 hover:bg-[#00b873]' 
                    : 'bg-[#0F4CFF] shadow-[#0F4CFF]/25 hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Agregado al carrito
                  </>
                ) : !user ? (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Iniciar sesión para comprar
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Agregar al carrito
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4CFF]" />
                <p className="text-xs leading-relaxed text-gray-500">
                  Tu diseño será revisado por nuestro equipo de calidad antes de la impresión.
                  Te notificaremos si necesitamos ajustes. El tiempo de producción es de 24-48 horas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}