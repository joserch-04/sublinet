import { Link } from 'react-router-dom';
import { Palette, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Palette className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-ink-900">
                Subli<span className="text-brand-600">Net</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Conectamos tu creatividad con la mejor tecnología de sublimación. Diseños únicos, calidad garantizada.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-ink-900">Productos</h4>
            <ul className="mt-3 space-y-2">
              {['Tazas', 'Ropa', 'Accesorios', 'Hogar', 'Regalos'].map(item => (
                <li key={item}>
                  <Link to="/catalogo" className="text-sm text-ink-500 transition-colors hover:text-brand-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-900">Empresa</h4>
            <ul className="mt-3 space-y-2">
              {['Sobre Nosotros', 'Cómo Funciona', 'Preguntas Frecuentes', 'Términos y Condiciones'].map(item => (
                <li key={item}>
                  <span className="cursor-pointer text-sm text-ink-500 transition-colors hover:text-brand-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-ink-900">Contacto</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-start gap-2 text-sm text-ink-500">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                hola@sublinet.com
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-500">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                +505 8354 5980
              </li>
              <li className="flex items-start gap-2 text-sm text-ink-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                Leon, Nicaragua
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6 text-center text-sm text-ink-400">
          © 2026 SubliNet. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
