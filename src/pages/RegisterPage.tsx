import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Intentar registrar
    if (register(name, email, password)) {
      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } else {
      setError('El correo ya está registrado');
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 animate-fade-in">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00D084] text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#111827]">¡Registro exitoso!</h1>
          <p className="mt-1 text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D084] to-[#0F4CFF] text-white">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#111827]">Crear cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">Regístrate para empezar a personalizar</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Nombre completo */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
              placeholder="Tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Correo electrónico */}
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

          {/* Contraseña */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
                placeholder="Mínimo 6 caracteres"
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

          {/* Confirmar contraseña */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#0F4CFF] focus:ring-2 focus:ring-[#0F4CFF]/20"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D084] px-6 py-3 text-sm font-semibold text-[#111827] shadow-lg shadow-[#00D084]/25 transition-all hover:bg-[#00b872] hover:shadow-[#00D084]/40 active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/login" 
            className="font-medium text-[#0F4CFF] hover:text-[#0d3fd9] cursor-pointer transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}