import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
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
  sparklesOutline
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
  selectedFoodTypes: string[] = [];
  selectedBudget: string = '';
  selectedPlaceTypes: string[] = [];

  foodTypes = [
    { id: 'italian', label: 'Italiana', icon: 'pizza-outline' },
    { id: 'mexican', label: 'Mexicana', icon: 'restaurant-outline' },
    { id: 'asian', label: 'Asiática', icon: 'fish-outline' },
    { id: 'vegetarian', label: 'Vegetariana', icon: 'leaf-outline' },
    { id: 'cafe', label: 'Café', icon: 'cafe-outline' },
    { id: 'dessert', label: 'Postres', icon: 'ice-cream-outline' },
  ];

  budgetOptions = [
    { id: 'low', label: 'Económico', symbol: '$', description: 'Menos de $15' },
    { id: 'medium', label: 'Moderado', symbol: '$$', description: '$15 - $40' },
    { id: 'high', label: 'Premium', symbol: '$$$', description: 'Más de $40' },
  ];

  placeTypes = [
    { id: 'casual', label: 'Casual', icon: 'storefront-outline' },
    { id: 'formal', label: 'Formal', icon: 'restaurant-outline' },
    { id: 'bar', label: 'Bar/Pub', icon: 'wine-outline' },
    { id: 'familyfriendly', label: 'Familiar', icon: 'home-outline' },
  ];

  constructor(private router: Router) {
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
      sparklesOutline
    });
  }

  ngOnInit() {
  }

  toggleFoodType(id: string) {
    if (this.selectedFoodTypes.includes(id)) {
      this.selectedFoodTypes = this.selectedFoodTypes.filter(t => t !== id);
    } else {
      this.selectedFoodTypes = [...this.selectedFoodTypes, id];
    }
  }

  selectBudget(id: string) {
    this.selectedBudget = id;
  }

  togglePlaceType(id: string) {
    if (this.selectedPlaceTypes.includes(id)) {
      this.selectedPlaceTypes = this.selectedPlaceTypes.filter(t => t !== id);
    } else {
      this.selectedPlaceTypes = [...this.selectedPlaceTypes, id];
    }
  }

  handleBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      // Go back to welcome
      this.router.navigateByUrl('/welcome');
    }
  }

  handleNext() {
    if (this.currentStep < 2) {
      this.currentStep++;
    } else {
      this.completePreferences();
    }
  }

  canContinue(): boolean {
    if (this.currentStep === 1) return this.selectedFoodTypes.length > 0;
    // Step 2 now requires both budget and place type
    if (this.currentStep === 2) return this.selectedBudget !== '' && this.selectedPlaceTypes.length > 0;
    return false;
  }

  getPollyMessage(): string {
    if (this.currentStep === 1) return "¡Hola! Soy Polly 🐙. Ayúdame a conocerte mejor. ¿Qué tipo de comida te gusta?";
    if (this.currentStep === 2) return "¡Entendido! Ahora selecciona tu presupuesto y el ambiente que prefieres.";
    return "";
  }

  completePreferences() {
    console.log('Preferences completed:', {
      food: this.selectedFoodTypes,
      budget: this.selectedBudget,
      place: this.selectedPlaceTypes
    });
    // Navigate to Recommendations (Home)
    this.router.navigateByUrl('/home');
  }
}
