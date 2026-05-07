import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="border-b border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Catálogo de productos
          </h1>
          <p className="mt-2 text-ink-500">Encuentra el producto perfecto para tu diseño</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-ink-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input-field w-auto py-2 pr-8"
            >
              <option value="popular">Más populares</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8">
          <p className="mb-4 text-sm text-ink-500">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado
            {filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-ink-50 py-20">
              <Search className="h-12 w-12 text-ink-300" />
              <h3 className="mt-4 text-lg font-semibold text-ink-700">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-ink-500">Intenta con otra búsqueda o categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
