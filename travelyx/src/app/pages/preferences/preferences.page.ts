import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  pizzaOutline,
  restaurantOutline,
  fishOutline,
  leafOutline,
  cafeOutline,
  iceCreamOutline,
  storefrontOutline,
  wineOutline,
  homeOutline,
  checkmarkCircle,
  chevronForwardOutline,
  sparklesOutline,
  fastFoodOutline,
  basketOutline,
  sunnyOutline,
  bedOutline,
  mapOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, CommonModule, FormsModule]
})
export class PreferencesPage implements OnInit {
  currentStep = 1;
  selectedFoodType: string = '';
  selectedBudget: string = '';
  selectedPlaceType: string = '';

  foodTypes: { id: string, label: string, icon: string }[] = [];

  budgetOptions = [
    { id: 'low', label: 'Económico', symbol: '$', description: 'Menos de $15' },
    { id: 'medium', label: 'Moderado', symbol: '$$', description: '$15 - $40' },
    { id: 'high', label: 'Premium', symbol: '$$$', description: 'Más de $40' },
  ];

  placeTypes = [
    { id: 'Restaurante', label: 'Restaurante', icon: 'restaurant-outline' },
    { id: 'Hotel', label: 'Hotel', icon: 'bed-outline' },
    { id: 'Zona Turística', label: 'Zona Turística', icon: 'map-outline' },
    { id: 'Todos', label: 'Explorar Todo', icon: 'sparkles-outline' },
  ];

  constructor(private router: Router, private restaurantService: RestaurantService) {
    addIcons({
      arrowBackOutline,
      pizzaOutline,
      restaurantOutline,
      fishOutline,
      leafOutline,
      cafeOutline,
      iceCreamOutline,
      storefrontOutline,
      wineOutline,
      homeOutline,
      checkmarkCircle,
      chevronForwardOutline,
      sparklesOutline,
      fastFoodOutline,
      basketOutline,
      sunnyOutline,
      bedOutline,
      mapOutline
    });
  }

  ngOnInit() {
    this.loadDynamicCategories();
  }

  loadDynamicCategories() {
    this.restaurantService.getCategories().subscribe({
      next: (categories: string[]) => {
        // Map common strings to icons. Fallback to restaurant-outline for unknowns.
        const iconMap: { [key: string]: string } = {
          'italiana': 'wine-outline',
          'pizzería': 'pizza-outline',
          'pizzeria': 'pizza-outline',
          'mexicana': 'restaurant-outline',
          'asiática': 'restaurant-outline',
          'asiatica': 'restaurant-outline',
          'vegetariana': 'leaf-outline',
          'café': 'cafe-outline',
          'cafe': 'cafe-outline',
          'postres': 'ice-cream-outline',
          'rápida': 'fast-food-outline',
          'rapida': 'fast-food-outline',
          'hamburguesas': 'fast-food-outline',
          'mariscos': 'fish-outline',
          'panadería': 'basket-outline',
          'panaderia': 'basket-outline',
          'caribbean': 'sunny-outline',
          'caribeña': 'sunny-outline'
        };

        this.foodTypes = categories.map(cat => {
          const lowerCat = cat.toLowerCase().trim();
          return {
            id: lowerCat,           // use lowercased name as ID
            label: cat,             // display original name
            icon: iconMap[lowerCat] || 'restaurant-outline' // generic icon if not mapped
          };
        });

        // Always ensure a fallback if DB is empty or has no categories yet
        if (this.foodTypes.length === 0) {
          this.foodTypes = [
             { id: 'general', label: 'Cualquiera', icon: 'restaurant-outline' }
          ];
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        // Fallback data if backend fails
        this.foodTypes = [
          { id: 'mexicana', label: 'Mexicana (Fallback)', icon: 'restaurant-outline' }
        ];
      }
    });
  }

  toggleFoodType(id: string) {
    this.selectedFoodType = id;
    this.autoAdvance();
  }

  selectBudget(id: string) {
    this.selectedBudget = id;
    this.autoAdvance();
  }

  togglePlaceType(id: string) {
    this.selectedPlaceType = id;
    this.autoAdvance();
  }

  autoAdvance() {
    setTimeout(() => {
      if (this.currentStep < 3) {
        this.currentStep++;
      } else {
        this.completePreferences();
      }
    }, 450); // 450ms delay to show the selection feedback visually before advancing
  }

  handleBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      // Go back to welcome
      this.router.navigateByUrl('/welcome');
    }
  }

  canContinue(): boolean {
    if (this.currentStep === 1) return this.selectedFoodType !== '';
    if (this.currentStep === 2) return this.selectedBudget !== '';
    if (this.currentStep === 3) return this.selectedPlaceType !== '';
    return false;
  }

  getPollyMessage(): string {
    if (this.currentStep === 1) return "¡Hola! Soy Polly 🐙. Ayúdame a conocerte mejor. ¿Qué tipo de comida te gusta?";
    if (this.currentStep === 2) return "¡Entendido! Ahora, ¿cuánto tienes pensado gastar?";
    if (this.currentStep === 3) return "¡Casi listos! Por último, elige el ambiente que prefieres para hoy.";
    return "";
  }

  completePreferences() {
    console.log('Preferences completed:', {
      food: this.selectedFoodType,
      budget: this.selectedBudget,
      place: this.selectedPlaceType
    });
    // Navigate to Recommendations (Home) with state
    this.router.navigate(['/home'], {
      state: {
        preferences: {
          food: this.selectedFoodType,
          budget: this.selectedBudget,
          place: this.selectedPlaceType
        }
      }
    });
  }
}
