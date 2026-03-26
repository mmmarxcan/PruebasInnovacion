import { useState } from 'react';
import { OctopusMascot } from './OctopusMascot';
import { Button } from './ui/button';
import { ArrowLeft, DollarSign } from 'lucide-react';

interface BudgetScreenProps {
  onNext: (budget: string) => void;
  onBack: () => void;
  selected: string;
}

const budgetOptions = [
  { id: 'bajo', label: 'Económico', price: '$', color: 'from-emerald-400 to-green-500', desc: 'Hasta $200 por persona' },
  { id: 'medio', label: 'Moderado', price: '$$', color: 'from-amber-400 to-yellow-500', desc: '$200 - $500 por persona' },
  { id: 'alto', label: 'Premium', price: '$$$', color: 'from-purple-500 to-pink-500', desc: 'Más de $500 por persona' },
];

export function BudgetScreen({ onNext, onBack, selected }: BudgetScreenProps) {
  const [selectedBudget, setSelectedBudget] = useState<string>(selected);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-50/30 via-white to-purple-50/30">
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
            </div>
            <span className="text-sm text-slate-600 font-medium">Paso 2 de 3</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col px-8 pb-8 overflow-y-auto">
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="scale-75">
            <OctopusMascot message="¿Cuál es tu presupuesto aproximado? 💰" />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {budgetOptions.map((option, index) => {
            const isSelected = selectedBudget === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedBudget(option.id)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`${
                  isSelected
                    ? 'border-2 border-purple-500 ring-4 ring-purple-200 bg-gradient-to-br from-purple-50 to-cyan-50'
                    : 'border border-slate-200 hover:border-purple-300 bg-white hover:shadow-lg'
                } p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-left`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      isSelected ? `bg-gradient-to-br ${option.color}` : 'bg-slate-100'
                    } transition-all duration-300`}
                  >
                    <DollarSign className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`text-lg font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                      {option.label}
                    </p>
                    <p className="text-sm text-slate-500">{option.desc}</p>
                    <p className={`text-xl font-bold mt-1 ${isSelected ? 'text-purple-600' : 'text-slate-600'}`}>
                      {option.price}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón inferior */}
      <div className="p-6 pt-4 animate-in fade-in slide-in-from-bottom duration-500">
        <Button
          onClick={() => onNext(selectedBudget)}
          disabled={!selectedBudget}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-full py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}
