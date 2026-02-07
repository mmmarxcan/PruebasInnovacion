import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  star,
  checkmarkCircle,
  sparklesOutline
} from 'ionicons/icons';

interface RecommendedRestaurant {
  id: number;
  name: string;
  type: string;
  rating: number;
  priceLevel: string;
  description: string;
  reason: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, CommonModule, FormsModule],
})
export class HomePage {
  selectedRestaurants: number[] = [];

  recommendedRestaurants: RecommendedRestaurant[] = [
    {
      id: 1,
      name: "La Trattoria Bella",
      type: "Italiana",
      rating: 4.8,
      priceLevel: "$$",
      description: "Auténtica cocina italiana con pasta fresca hecha a mano",
      reason: "Perfecta para comida italiana casual"
    },
    {
      id: 2,
      name: "Tacos El Güero",
      type: "Mexicana",
      rating: 4.6,
      priceLevel: "$",
      description: "Los mejores tacos al pastor de la ciudad",
      reason: "Económico y muy bien valorado"
    },
    {
      id: 3,
      name: "Sushi Zen",
      type: "Asiática",
      rating: 4.9,
      priceLevel: "$$$",
      description: "Sushi premium con ingredientes importados",
      reason: "Experiencia única de sushi"
    },
    {
      id: 4,
      name: "Green Garden",
      type: "Vegetariana",
      rating: 4.7,
      priceLevel: "$$",
      description: "Opciones vegetarianas creativas y saludables",
      reason: "Ideal para opciones saludables"
    },
  ];

  constructor(private router: Router) {
    addIcons({ star, checkmarkCircle, sparklesOutline });
  }

  toggleRestaurant(id: number) {
    if (this.selectedRestaurants.includes(id)) {
      this.selectedRestaurants = this.selectedRestaurants.filter(r => r !== id);
    } else {
      this.selectedRestaurants.push(id);
    }
  }

  handleContinue() {
    console.log('Selected restaurants:', this.selectedRestaurants);
    // Navigate to Map
    this.router.navigateByUrl('/map');
  }
}
