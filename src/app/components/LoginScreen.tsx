import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onSkip: () => void;
}

export function LoginScreen({ onLogin, onRegister, onSkip }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50/50 via-white to-cyan-50/50">
      {/* Header */}
      <div className="p-4 flex items-center justify-between animate-in fade-in duration-300">
        <button
          onClick={onSkip}
          className="p-2 hover:bg-purple-100 rounded-full transition-all hover:scale-110 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-purple-700" />
        </button>
        <button
          onClick={onSkip}
          className="text-purple-600 text-sm hover:underline font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition-all"
        >
          Saltar
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col px-8 pb-8 justify-center">
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Travelyx
          </h1>
          <p className="text-slate-600">Inicia sesión para una mejor experiencia</p>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              Opcional
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-700">
          <div>
            <label className="text-sm text-slate-700 mb-2 block font-medium">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-700 mb-2 block font-medium">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full py-6 text-lg mt-6 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="my-6 flex items-center animate-in fade-in duration-700">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-sm text-slate-500 font-medium">o</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <Button
          variant="outline"
          className="w-full border-2 border-slate-300 hover:border-purple-300 hover:bg-purple-50 rounded-full py-6 text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in duration-700"
          onClick={onLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium">Continuar con Google</span>
        </Button>

        <div className="mt-6 text-center animate-in fade-in duration-700">
          <p className="text-slate-600">
            ¿No tienes cuenta?{' '}
            <button onClick={onRegister} className="text-purple-600 hover:underline font-semibold">
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
