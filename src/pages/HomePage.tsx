import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Truck,
  Shield,
  Palette,
  Zap,
  Star,
  Shirt,
  ShoppingBag,
  BadgeCheck,
  ChevronDown,
  MousePointerClick,
  Infinity,
  Flame,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

// ─── Canvas de partículas interactivas ───
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
    }

    const particles: Particle[] = [];
    const colors = ['#0F4CFF', '#00D084', '#ffffff', '#7fb0ff'];

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x, y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Fuerza de atracción al mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.vx += dx * force * 0.02;
          p.vy += dy * force * 0.02;
        }

        // Regreso a posición base
        p.vx += (p.baseX - p.x) * 0.001;
        p.vy += (p.baseY - p.y) * 0.001;

        // Fricción
        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx;
        p.y += p.vy;

        // Dibujar
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.random() * 0.5 + 0.3;
        ctx.fill();

        // Brillo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.05;
        ctx.fill();
      });

      // Conexiones
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#0F4CFF';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
    />
  );
}

// ─── Contador animado ───
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Card 3D con tilt effect ───
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 15;
    const tiltY = (x - 0.5) * -15;
    setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ─── Texto con efecto de escritura ───
function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-[#0F4CFF]">|</span>
    </span>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const popularProducts = products.filter(p => p.popular).slice(0, 4);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-hidden bg-[#f7faff]">
      {/* ═══════════════════════════════════════
          HERO SECTION - Con partículas 3D
      ═══════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#111827] via-[#16213E] to-[#0F4CFF]">
        <HeroParticles />

        {/* Grid decorativo con parallax */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)`,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        {/* Orbes de luz flotantes */}
        <div
          className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-[#0F4CFF]/30 blur-[100px] animate-pulse"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
        <div
          className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-[#00D084]/20 blur-[100px] animate-pulse"
          style={{ animationDelay: '1s', transform: `translateY(${scrollY * -0.15}px)` }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-0 min-h-screen">
          {/* LEFT CONTENT */}
          <div className="animate-[fadeInUp_1s_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0F4CFF]/30 bg-white/5 px-4 py-2 text-sm font-medium text-[#7fb0ff] backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group">
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="relative">
                Sublimación profesional en Nicaragua
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#00D084] group-hover:w-full transition-all duration-500" />
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[1.1] text-white lg:text-7xl">
              <span className="block overflow-hidden">
                <span className="block animate-[slideUp_0.8s_ease-out_0.3s_both]">Personaliza</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-[slideUp_0.8s_ease-out_0.5s_both]">tus productos</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block bg-gradient-to-r from-[#0F4CFF] via-[#00D084] to-[#0F4CFF] bg-clip-text text-transparent animate-[slideUp_0.8s_ease-out_0.7s_both] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                  con estilo único
                </span>
              </span>
            </h1>

            <div className="mt-6 h-6">
              <TypewriterText
                text="Diseña camisetas, tazas, totebags y más con calidad premium..."
                className="text-lg text-gray-300"
              />
            </div>

            {/* Botones con efectos épicos */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/catalogo"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#0F4CFF] px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-[#0F4CFF]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#0F4CFF]/60"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Explorar catálogo
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              </Link>

              <Link
                to="/catalogo"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-[#00D084]/50"
              >
                <MousePointerClick className="h-4 w-4 text-[#00D084] group-hover:scale-110 transition-transform" />
                Cómo funciona
              </Link>
            </div>

            {/* Stats con contadores animados */}
            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { value: 1000, suffix: '+', label: 'Productos sublimados' },
                { value: 49, suffix: '', label: 'Valoración clientes', prefix: '4.' },
                { value: 24, suffix: 'h', label: 'Producción rápida' },
              ].map((stat, i) => (
                <div key={stat.label} className="group cursor-default">
                  <h3 className="text-3xl font-black text-white group-hover:text-[#00D084] transition-colors">
                    {stat.prefix}
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Card 3D flotante */}
          <div className="relative flex items-center justify-center animate-[fadeIn_1.2s_ease-out_0.5s_both]">
            <div
              className="absolute h-[500px] w-[500px] rounded-full border border-[#0F4CFF]/20 animate-[spin_20s_linear_infinite]"
              style={{ borderStyle: 'dashed' }}
            />
            <div
              className="absolute h-[350px] w-[350px] rounded-full border border-[#00D084]/20 animate-[spin_15s_linear_infinite_reverse]"
              style={{ borderStyle: 'dashed' }}
            />

            <TiltCard className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0F4CFF] to-[#00D084] rounded-[2rem] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-2xl shadow-2xl">
               {/* Floating badges */}
<div className="absolute -left-8 top-10 animate-[float_3s_ease-in-out_infinite]">
  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl shadow-lg">
    <Palette className="h-6 w-6 text-[#00D084]" />
  </div>
</div>

<div className="absolute -right-8 bottom-20 animate-[float_3s_ease-in-out_infinite_1s]">
  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl shadow-lg">
    <Zap className="h-6 w-6 text-[#0F4CFF]" />
  </div>
</div>

<div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F4CFF] to-[#00D084] p-1 shadow-2xl">
  <div className="rounded-[22px] bg-[#111827] p-5">
    
    <div className="flex items-center justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-gray-400">
          Producto destacado
        </p>

        <h3 className="mt-1 text-xl font-bold text-white">
          Camiseta Premium
        </h3>
      </div>

      <div className="flex items-center gap-1 rounded-xl bg-[#0F4CFF]/20 px-3 py-1">
        <Flame className="h-3 w-3 text-[#00D084]" />
        <span className="text-xs font-bold text-[#7fb0ff]">
          HOT
        </span>
      </div>
    </div>

    {/* PRODUCT IMAGE */}
    <div className="group/img mt-4 relative">

      <div className="absolute inset-0 scale-75 rounded-full bg-[#0F4CFF]/20 blur-2xl transition-transform duration-500 group-hover/img:scale-100" />

      <img
        src="https://www.distrikher.com/wp-content/uploads/2024/06/CAMISETA-153-GR-FRENTE.webp.jpg"
        alt="Producto"
        className="relative h-64 w-full rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover/img:scale-105"
      />

      {/* CLICKABLE OVERLAY */}
      <Link
        to="producto/shirt-01"
        className="absolute inset-0 z-10 flex items-end justify-center rounded-2xl bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-white">
          <MousePointerClick className="h-4 w-4" />
          Click para personalizar
        </span>
      </Link>
    </div>

    {/* BOTTOM */}
    <div className="mt-4 flex items-center justify-between">

      <div>
        <p className="text-xs text-gray-400">
          A solo
        </p>

        <h4 className="text-2xl font-black text-white">
          C$350
        </h4>
      </div>

      {/* BUTTON */}
      <Link
        to="producto/shirt-01"
        className="group/btn relative overflow-hidden rounded-xl bg-[#00D084] px-5 py-3 text-sm font-bold text-[#111827] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00D084]/30"
      >
        <span className="relative z-10 flex items-center gap-2">
          Personalizar

          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </span>
      </Link>
    </div>
  </div>
</div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/50" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES - Cards con hover épico
      ═══════════════════════════════════════ */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0F4CFF]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#0F4CFF]/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0F4CFF]/10 px-4 py-1.5 text-sm font-bold text-[#0F4CFF]">
              <Infinity className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
              Proceso simplificado
            </span>
            <h2 className="mt-4 text-4xl font-black text-[#111827] sm:text-5xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Tres pasos para llevar tu creatividad al mundo real. Sin complicaciones.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Palette,
                title: 'Sube tu diseño',
                desc: 'Carga imágenes, logos o ilustraciones en nuestro editor intuitivo.',
                step: '01',
                color: '#0F4CFF',
              },
              {
                icon: Shirt,
                title: 'Elige tu producto',
                desc: 'Selecciona entre camisetas, tazas, totebags y mucho más.',
                step: '02',
                color: '#00D084',
              },
              {
                icon: Truck,
                title: 'Recíbelo rápido',
                desc: 'Producción express en 24h y envío seguro a tu puerta.',
                step: '03',
                color: '#0F4CFF',
              },
            ].map((item, i) => (
              <TiltCard key={item.step}>
                <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-transparent">
                  {/* Fondo gradiente en hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F4CFF]/5 to-[#00D084]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Número grande decorativo */}
                  <div className="absolute -right-4 -top-8 text-[8rem] font-black text-gray-100 group-hover:text-[#0F4CFF]/10 transition-colors duration-500 select-none">
                    {item.step}
                  </div>

                  <div className="relative">
                    {/* Icono con animación */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F4CFF]/10 group-hover:bg-[#0F4CFF] transition-all duration-500">
                      <item.icon className="h-8 w-8 text-[#0F4CFF] group-hover:text-white transition-colors duration-500 group-hover:scale-110 transform" />
                      {/* Ring animado */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#0F4CFF]/0 group-hover:border-[#0F4CFF]/30 group-hover:scale-125 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    </div>

                    <span className="mt-6 inline-flex items-center gap-1 text-xs font-black text-[#00D084] uppercase tracking-widest">
                      <Zap className="h-3 w-3" />
                      Paso {item.step}
                    </span>

                    <h3 className="mt-3 text-2xl font-bold text-[#111827] group-hover:text-[#0F4CFF] transition-colors">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-relaxed text-gray-500 group-hover:text-gray-600">
                      {item.desc}
                    </p>

                    {/* Línea decorativa */}
                    <div className="mt-6 h-1 w-12 rounded-full bg-gray-200 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-[#0F4CFF] group-hover:to-[#00D084] transition-all duration-500" />
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          POPULAR PRODUCTS - Grid con parallax
      ═══════════════════════════════════════ */}
      <section className="py-24 bg-[#f7faff] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0F4CFF]/20 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold text-[#00D084] uppercase tracking-widest">En tendencia</span>
              <h2 className="mt-2 text-4xl font-black text-[#111827] sm:text-5xl">
                Productos populares
              </h2>
              <p className="mt-2 text-gray-500">
                Los favoritos de nuestra comunidad creativa.
              </p>
            </div>

            <Link
              to="/catalogo"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:shadow-xl hover:shadow-[#0F4CFF]/40 hover:-translate-y-0.5"
            >
              Ver todo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-[fadeInUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BADGES - Grid con hover magnético
      ═══════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,76,255,0.03)_0%,transparent_70%)]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#111827]">
              ¿Por qué elegirnos?
            </h2>
            <div className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-[#0F4CFF] to-[#00D084]" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: 'Calidad garantizada',
                desc: 'Cada pedido revisado cuidadosamente antes de envío.',
              },
              {
                icon: Truck,
                title: 'Envío express',
                desc: 'Entrega rápida y segura en toda Nicaragua.',
              },
              {
                icon: Star,
                title: 'Clientes felices',
                desc: 'Miles de valoraciones positivas y recomendaciones.',
              },
              {
                icon: BadgeCheck,
                title: 'Tecnología HD',
                desc: 'Colores vibrantes y acabados profesionales premium.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group relative rounded-3xl border border-gray-100 bg-[#f7faff] p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-[#0F4CFF]/20 hover:bg-white"
              >
                {/* Icono flotante */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md group-hover:shadow-lg group-hover:shadow-[#0F4CFF]/20 transition-all duration-500 group-hover:scale-110">
                  <item.icon className="h-7 w-7 text-[#0F4CFF] group-hover:text-[#00D084] transition-colors duration-300" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#111827] group-hover:text-[#0F4CFF] transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>

                {/* Indicador decorativo */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#0F4CFF] to-[#00D084] rounded-b-3xl group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA FINAL - Con efecto de ondas
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F4CFF] to-[#00D084] py-24">
        {/* Ondas decorativas */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Partículas flotantes */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/30 animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur-md mb-6">
            <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
            ¿Listo para crear?
          </div>

          <h2 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Empieza a personalizar
            <span className="block text-white/90">hoy mismo</span>
          </h2>

          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            Únete a miles de creadores que confían en SubliNet para llevar sus diseños al siguiente nivel.
          </p>

          <Link
            to="/catalogo"
            className="group mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-black text-[#111827] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/25"
          >
            Explorar productos
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
          </Link>

          {/* Stats del CTA */}
          <div className="mt-12 flex justify-center gap-8 text-white/60 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Envío seguro
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> 24h producción
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4" /> 4.9/5 valoración
            </span>
          </div>
        </div>
      </section>

      {/* CSS Keyframes inline */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}