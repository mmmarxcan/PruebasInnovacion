import { OctopusMascot } from './OctopusMascot';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 py-12 bg-gradient-to-b from-cyan-50/30 via-white to-purple-50/30">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center mb-2 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Travelyx
          </h1>
          <p className="text-slate-600 text-sm">Tu guía en Progreso, Yucatán</p>
        </div>

        <OctopusMascot message="¡Hola! Soy Polly, tu guía turístico. ¿Listo para descubrir los mejores lugares? 🌊" />

        <div className="text-center space-y-3 mt-4 animate-in fade-in duration-1000">
          <h2 className="text-2xl text-slate-800 font-semibold">Bienvenido</h2>
          <p className="text-slate-600 max-w-[280px] leading-relaxed">
            Voy a ayudarte a encontrar lugares increíbles según tus gustos y preferencias
          </p>
        </div>
      </div>

      <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom duration-700">
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full py-7 text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            ¡Empecemos a explorar!
            <span className="text-xl">🚀</span>
          </span>
        </Button>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse mr-1"></span>
            Descubre Progreso, Yucatán
          </p>
        </div>
      </div>
    </div>
  );
}
