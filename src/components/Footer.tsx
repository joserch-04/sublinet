import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
<div className="md:col-span-1">
  <div className="flex items-center gap-3">
    
    {/* Logo */}
    <img
      src="public/images/SUBLINET_LOGO.png"
      alt="SUBLINET Logo"
      className="h-12 w-12 rounded-xl object-contain shadow-md"
    />

    {/* Nombre */}
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-[#0F4CFF]">
        SUBL<span className="text-[#00D084]">INET</span>
      </h2>
      <p className="text-xs text-gray-500">
        Tecnología & Creatividad
      </p>
    </div>
  </div>

  {/* Descripción */}
  <p className="mt-4 text-sm leading-relaxed text-gray-500">
    Conectamos tu creatividad con la mejor tecnología de sublimación.
    Diseños únicos, acabados profesionales y calidad garantizada
    para cada uno de tus proyectos.
  </p>
</div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827]">Productos</h4>
            <ul className="mt-3 space-y-2">
              {['Tazas', 'Ropa', 'Accesorios', 'Hogar', 'Regalos'].map(item => (
                <li key={item}>
                  <Link to="/catalogo" className="text-sm text-gray-500 transition-colors hover:text-[#0F4CFF]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827]">Empresa</h4>
            <ul className="mt-3 space-y-2">
              {['Sobre Nosotros', 'Cómo Funciona', 'Preguntas Frecuentes', 'Términos y Condiciones'].map(item => (
                <li key={item}>
                  <span className="cursor-pointer text-sm text-gray-500 transition-colors hover:text-[#0F4CFF]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827]">Contacto</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4CFF]" />
                hola@sublinet.com
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4CFF]" />
                +505 8354 5980
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4CFF]" />
                Leon, Nicaragua
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
          © 2026 SubliNet. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}