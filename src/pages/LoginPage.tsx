import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la URL de redirección (si viene del producto)
  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      // Redirigir a la página anterior o al inicio
      navigate(from, { replace: true });
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F4CFF] to-[#00D084] text-white">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#111827]">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4CFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F4CFF]/25 transition-all hover:bg-[#0d3fd9] hover:shadow-[#0F4CFF]/40 active:scale-95"
          >
            Iniciar sesión
          </button>
        </form>


        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <span className="font-medium text-[#0F4CFF] hover:text-[#0d3fd9] cursor-pointer transition-colors">
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}