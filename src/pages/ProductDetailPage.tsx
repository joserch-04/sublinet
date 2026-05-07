import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Check, Info } from 'lucide-react';
import DesignUploader from '@/components/DesignUploader';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/helpers';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = products.find(p => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-ink-900">Producto no encontrado</h2>
        <button onClick={() => navigate('/catalogo')} className="btn-primary mt-4">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, designUrl, selectedColor, selectedSize || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/catalogo')}
          className="mb-6 flex items-center gap-1 text-sm text-ink-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </button>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-2xl bg-ink-50">
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
              <span className="text-sm text-ink-400">({product.reviews} reseñas)</span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">{product.name}</h1>
            <p className="mt-3 text-lg font-bold text-brand-600">{formatPrice(product.basePrice)}</p>
            <p className="mt-4 leading-relaxed text-ink-600">{product.description}</p>

            {/* Color Selection */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-ink-900">Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
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
                <label className="text-sm font-semibold text-ink-900">Talla</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
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
              <label className="text-sm font-semibold text-ink-900">Tu diseño</label>
              <div className="mt-2">
                <DesignUploader onDesignUpload={setDesignUrl} previewProduct={product.image} />
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-ink-200 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-ink-500 transition-colors hover:text-ink-900"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-ink-500 transition-colors hover:text-ink-900"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`btn-primary flex-1 ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Agregado al carrito
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
            <div className="mt-6 rounded-xl bg-ink-50 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                <p className="text-xs leading-relaxed text-ink-500">
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
