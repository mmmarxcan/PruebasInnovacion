import { useState } from 'react';
import { MapPin, SlidersHorizontal, Navigation, Star, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Preferences {
  foodType: string[];
  budget: string;
  placeType: string[];
}

interface MapScreenProps {
  preferences: Preferences;
}

interface Restaurant {
  id: number;
  name: string;
  type: string;
  rating: number;
  price: string;
  distance: string;
  lat: number;
  lng: number;
  image: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'La Trattoria',
    type: 'Italiana',
    rating: 4.5,
    price: '$$',
    distance: '0.5 km',
    lat: 19.432608,
    lng: -99.133209,
    image: 'https://images.unsplash.com/photo-1722587561829-8a53e1935e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc3MDIwOTY5MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    name: 'Taco Loco',
    type: 'Mexicana',
    rating: 4.8,
    price: '$',
    distance: '0.8 km',
    lat: 19.433608,
    lng: -99.134209,
    image: 'https://images.unsplash.com/photo-1688845465690-e5ea24774fd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjb3MlMjBmb29kfGVufDF8fHx8MTc3MDIxOTcwMXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    name: 'Green Bowl',
    type: 'Vegetariana',
    rating: 4.3,
    price: '$$',
    distance: '1.2 km',
    lat: 19.431608,
    lng: -99.132209,
    image: 'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwdmVnZXRhcmlhbiUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NzAyNjY0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    name: 'Mar Azul',
    type: 'Mariscos',
    rating: 4.6,
    price: '$$$',
    distance: '2.1 km',
    lat: 19.434608,
    lng: -99.135209,
    image: 'https://images.unsplash.com/photo-1633195000232-ca6e3cbcfd41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcmVzdGF1cmFudCUyMHBsYXRlfGVufDF8fHx8MTc3MDI2NjQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function MapScreen({ preferences }: MapScreenProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [showList, setShowList] = useState(true);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between z-10">
        <h1 className="text-xl text-purple-600">Travelyx</h1>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Mapa simulado */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
          {/* Grid del mapa */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Marcadores de restaurantes */}
          {mockRestaurants.map((restaurant, index) => (
            <button
              key={restaurant.id}
              onClick={() => setSelectedRestaurant(restaurant.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-full transition-all ${
                selectedRestaurant === restaurant.id ? 'scale-125' : 'hover:scale-110'
              }`}
              style={{
                left: `${30 + index * 15}%`,
                top: `${35 + (index % 2) * 20}%`,
              }}
            >
              <div className="relative">
                <MapPin
                  className={`w-10 h-10 ${
                    selectedRestaurant === restaurant.id
                      ? 'text-purple-600 fill-purple-600'
                      : 'text-red-500 fill-red-500'
                  }`}
                />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">
                  {restaurant.rating}
                </div>
              </div>
            </button>
          ))}

          {/* Botón para centrar ubicación */}
          <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <Navigation className="w-6 h-6 text-purple-600" />
          </button>
        </div>

        {/* Panel de lista de restaurantes */}
        {showList && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[60%] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg">Restaurantes Recomendados</h2>
              <button
                onClick={() => setShowList(false)}
                className="text-gray-500 text-sm"
              >
                Minimizar
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[400px] p-4 space-y-3">
              {mockRestaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant.id)}
                  className={`w-full bg-white border-2 ${
                    selectedRestaurant === restaurant.id
                      ? 'border-purple-600'
                      : 'border-gray-200'
                  } rounded-xl p-3 flex gap-3 hover:shadow-md transition-all`}
                >
                  <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-base mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.type}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{restaurant.price}</span>
                      </div>
                      <span>• {restaurant.distance}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón para mostrar lista si está minimizada */}
        {!showList && (
          <button
            onClick={() => setShowList(true)}
            className="absolute bottom-4 left-4 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            Ver Lista ({mockRestaurants.length})
          </button>
        )}
      </div>
    </div>
  );
}