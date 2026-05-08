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
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-[#0F4CFF]/20 p-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.popular && (
            <span className="absolute left-3 top-3 rounded-full bg-[#0F4CFF] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Popular
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-400 shadow-sm backdrop-blur-sm transition-colors hover:text-[#00D084]"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-[#111827] group-hover:text-[#0F4CFF] transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-[#111827]">
              {formatPrice(product.basePrice)}
            </span>
            <span className="rounded-full bg-[#00D084]/10 px-2 py-0.5 text-xs font-medium text-[#00D084]">
              Personalizar
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}