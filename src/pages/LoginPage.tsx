import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink-900">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-ink-500">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Correo electrónico</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                className="input-field pr-10"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Iniciar sesión
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-ink-50 p-4">
          <p className="text-xs font-medium text-ink-700">Credenciales de demo:</p>
          <div className="mt-2 space-y-1 text-xs text-ink-500">
            <p><span className="font-mono text-ink-700">admin@sublinet.com</span> / admin123 (Admin)</p>
            <p><span className="font-mono text-ink-700">cliente@demo.com</span> / demo123 (Cliente)</p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">
          ¿No tienes cuenta?{' '}
          <span className="font-medium text-brand-600 hover:text-brand-700 cursor-pointer">
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}
