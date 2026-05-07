import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield, Palette, Zap, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function HomePage() {
  const popularProducts = products.filter(p => p.popular).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-500 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent-violet blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Sublimación profesional a tu alcance
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tu diseño, en cualquier{' '}
              <span className="bg-gradient-to-r from-brand-400 to-accent-teal bg-clip-text text-transparent">
                superficie
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-300 sm:text-xl">
              Sube tu diseño, elige tu producto y nosotros nos encargamos del resto.
              Calidad garantizada con la red de sublimación más grande de México.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/catalogo" className="btn-primary w-full sm:w-auto">
                Explorar Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/catalogo" className="btn-secondary w-full sm:w-auto">
                Ver cómo funciona
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { value: '50K+', label: 'Diseños sublimados' },
                { value: '4.9', label: 'Calificación promedio' },
                { value: '24h', label: 'Tiempo de producción' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-ink-400 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-ink-500">Tres pasos simples para llevar tu diseño al mundo real</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Palette,
                step: '01',
                title: 'Sube tu diseño',
                desc: 'Carga tu imagen, logo o ilustración en nuestro editor. Soportamos PNG, JPG y SVG.',
              },
              {
                icon: Zap,
                step: '02',
                title: 'Elige tu producto',
                desc: 'Selecciona entre tazas, ropa, accesorios y más. Personaliza colores y tamaños.',
              },
              {
                icon: Truck,
                step: '03',
                title: 'Recibe en casa',
                desc: 'Nosotros conectamos tu pedido con el mejor sublimador. Envío rápido y seguro.',
              },
            ].map(item => (
              <div key={item.step} className="card text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
                  <item.icon className="h-6 w-6 text-brand-600" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold text-brand-500">PASO {item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="section-padding bg-ink-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Productos populares
              </h2>
              <p className="mt-2 text-ink-500">Los favoritos de nuestros clientes</p>
            </div>
            <Link
              to="/catalogo"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex"
            >
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/catalogo" className="btn-secondary">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: 'Garantía de calidad', desc: 'Cada pieza revisada antes de envío' },
              { icon: Truck, title: 'Envío express', desc: 'Entrega en 3-5 días hábiles' },
              { icon: Star, title: 'Satisfacción garantizada', desc: 'Reembolso si no te encanta' },
              { icon: Sparkles, title: 'Colores vibrantes', desc: 'Tecnología de sublimación HD' },
            ].map(badge => (
              <div key={badge.title} className="flex items-start gap-4 rounded-2xl bg-ink-50 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <badge.icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink-900">{badge.title}</h4>
                  <p className="mt-1 text-xs text-ink-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
