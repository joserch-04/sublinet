import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/producto/${product.id}`} className="group block">
      <div className="card overflow-hidden p-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-ink-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.popular && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Popular
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink-400 shadow-sm backdrop-blur-sm transition-colors hover:text-brand-500"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-ink-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-ink-900 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-ink-500">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-ink-900">
              {formatPrice(product.basePrice)}
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              Personalizar
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
