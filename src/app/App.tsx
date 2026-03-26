import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FoodTypeScreen } from './components/FoodTypeScreen';
import { BudgetScreen } from './components/BudgetScreen';
import { PlaceTypeScreen } from './components/PlaceTypeScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { MapScreen } from './components/MapScreen';

type Screen = 'welcome' | 'foodType' | 'budget' | 'placeType' | 'login' | 'register' | 'map';

interface Preferences {
  foodType: string[];
  budget: string;
  placeType: string[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [preferences, setPreferences] = useState<Preferences>({
    foodType: [],
    budget: '',
    placeType: [],
  });

  return (
    <div className="size-full bg-gradient-to-br from-cyan-50 via-purple-50 to-amber-50 flex items-center justify-center">
      <div className="w-full max-w-md h-full max-h-[844px] bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
        {currentScreen === 'welcome' && (
          <WelcomeScreen onNext={() => setCurrentScreen('foodType')} />
        )}
        {currentScreen === 'foodType' && (
          <FoodTypeScreen
            onNext={(foodTypes) => {
              setPreferences({ ...preferences, foodType: foodTypes });
              setCurrentScreen('budget');
            }}
            onBack={() => setCurrentScreen('welcome')}
            selected={preferences.foodType}
          />
        )}
        {currentScreen === 'budget' && (
          <BudgetScreen
            onNext={(budget) => {
              setPreferences({ ...preferences, budget });
              setCurrentScreen('placeType');
            }}
            onBack={() => setCurrentScreen('foodType')}
            selected={preferences.budget}
          />
        )}
        {currentScreen === 'placeType' && (
          <PlaceTypeScreen
            onNext={(placeTypes) => {
              setPreferences({ ...preferences, placeType: placeTypes });
              setCurrentScreen('login');
            }}
            onBack={() => setCurrentScreen('budget')}
            selected={preferences.placeType}
          />
        )}
        {currentScreen === 'login' && (
          <LoginScreen
            onLogin={() => setCurrentScreen('map')}
            onRegister={() => setCurrentScreen('register')}
            onSkip={() => setCurrentScreen('map')}
          />
        )}
        {currentScreen === 'register' && (
          <RegisterScreen
            onRegister={() => setCurrentScreen('map')}
            onBack={() => setCurrentScreen('login')}
          />
        )}
        {currentScreen === 'map' && (
          <MapScreen preferences={preferences} />
        )}
      </div>
    </div>
  );
}
