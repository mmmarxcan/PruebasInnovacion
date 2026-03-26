import { useState } from 'react';
import { OctopusMascot } from './OctopusMascot';
import { Button } from './ui/button';
import { ArrowLeft, Store, UtensilsCrossed, Wine, ShoppingBag } from 'lucide-react';

interface PlaceTypeScreenProps {
  onNext: (placeTypes: string[]) => void;
  onBack: () => void;
  selected: string[];
}

const placeOptions = [
  { id: 'casual', label: 'Casual', icon: Store, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-50' },
  { id: 'formal', label: 'Formal', icon: Wine, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
  { id: 'buffet', label: 'Buffet', icon: UtensilsCrossed, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50' },
  { id: 'foodtruck', label: 'Food Truck', icon: ShoppingBag, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50' },
];

export function PlaceTypeScreen({ onNext, onBack, selected }: PlaceTypeScreenProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(selected);

  const togglePlaceType = (id: string) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== id));
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50/30 via-white to-amber-50/30">
      {/* Header con botón de retorno */}
      <div className="p-4 flex items-center animate-in fade-in duration-300">
        <button
          onClick={onBack}
          className="p-2 hover:bg-purple-100 rounded-full transition-all hover:scale-110 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-purple-700" />
        </button>
        <div className="flex-1 text-center pr-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-purple-100">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            </div>
            <span className="text-sm text-slate-600 font-medium">Paso 3 de 3</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col px-8 pb-8 overflow-y-auto">
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="scale-75">
            <OctopusMascot message="¿Qué tipo de ambiente buscas? ¡Último paso! 🎉" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {placeOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedTypes.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => togglePlaceType(option.id)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`${option.bgColor} ${
                  isSelected
                    ? 'border-2 border-purple-500 ring-4 ring-purple-200 scale-95'
                    : 'border border-slate-200 hover:border-purple-300 hover:shadow-lg'
                } p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 animate-in fade-in zoom-in`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isSelected ? `bg-gradient-to-br ${option.color}` : 'bg-white'
                  } transition-all duration-300`}
                >
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedTypes.length > 0 && (
          <div className="text-center text-sm text-slate-600 animate-in fade-in duration-300">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
              {selectedTypes.length} {selectedTypes.length === 1 ? 'opción seleccionada' : 'opciones seleccionadas'}
            </span>
          </div>
        )}
      </div>

      {/* Botón inferior */}
      <div className="p-6 pt-4 animate-in fade-in slide-in-from-bottom duration-500">
        <Button
          onClick={() => onNext(selectedTypes)}
          disabled={selectedTypes.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-full py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
        >
          ¡Ver recomendaciones! 🎯
        </Button>
      </div>
    </div>
  );
}
