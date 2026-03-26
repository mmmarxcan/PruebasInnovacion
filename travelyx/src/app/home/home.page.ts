import { Component, OnInit } from '@angular/core';
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
import { RestaurantService } from '../services/restaurant';
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
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  selectedRestaurants: number[] = [];
  recommendedRestaurants: RecommendedRestaurant[] = [];
  preferences: any = null;

  constructor(private router: Router, private restaurantService: RestaurantService) {
    addIcons({ star, checkmarkCircle, sparklesOutline });
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['preferences']) {
      this.preferences = nav.extras.state['preferences'];
      console.log('Received preferences:', this.preferences);
    }
  }

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants: any[]) => {
        // For development, let's only hide 'blocked'. 
        // In production, you might want: r => r.estado === 'active'
        let filtered = restaurants.filter(r => r.estado !== 'blocked');

        // 1. Filter by Food Type (Category)
        if (this.preferences && this.preferences.food) {
          const foodPref = this.preferences.food.toLowerCase().trim();
          if (foodPref !== 'general') {
            const exactMatches = filtered.filter(r => r.categoria && r.categoria.toLowerCase().trim() === foodPref);
            // Si hay coincidencias exactas, las usamos. Si no, mostramos todos para no dejar la pantalla vacía.
            if (exactMatches.length > 0) {
              filtered = exactMatches;
            }
          }
        }

        // 2. Filter by Budget (if implemented in DB, usually nivel_precio)
        if (this.preferences && this.preferences.budget) {
          const budgetMap: { [key: string]: string } = { 'low': '$', 'medium': '$$', 'high': '$$$' };
          const budgetSymbol = budgetMap[this.preferences.budget];
          if (budgetSymbol) {
             const budgetMatches = filtered.filter(r => r.nivel_precio === budgetSymbol);
             // Si el filtro de presupuesto nos deja sin nada, mejor no aplicarlo para garantizar resultados
             if (budgetMatches.length > 0) {
               filtered = budgetMatches;
             }
          }
        }

        // 3. Filter by Place Type (nuevo campo 'tipo')
        if (this.preferences && this.preferences.place && this.preferences.place !== 'Todos') {
          const placePref = this.preferences.place.toLowerCase().trim();
          const placeMatches = filtered.filter(r => {
            const t = (r.tipo || 'restaurante').toLowerCase().trim();
            return t === placePref;
          });
          if (placeMatches.length > 0) {
            filtered = placeMatches;
          }
        }

        // Map DB fields to UI interface
        this.recommendedRestaurants = filtered.slice(0, 10).map(r => ({
          id: r.id,
          name: r.nombre,
          type: r.tipo || r.categoria || 'Variado',
          rating: Number(r.rating_promedio) || 5.0,
          priceLevel: r.nivel_precio || '$$',
          description: r.direccion || 'Excelente lugar para disfrutar.',
          lat: Number(r.latitud),
          lng: Number(r.longitud),
          reason: (this.preferences?.food && r.categoria && this.preferences.food === r.categoria.toLowerCase().trim()) 
                    ? 'Selección Perfecta' 
                    : 'Recomendado para ti'
        }));

        // Ultimate fallback si la base de datos está totalmente vacía
        if (this.recommendedRestaurants.length === 0) {
          this.recommendedRestaurants = [
             { id: 991, name: "La Trattoria Bella (Demo)", type: "Italiana", rating: 4.8, priceLevel: "$$", description: "Auténtica cocina italiana", lat: 21.2842, lng: -89.6547, reason: "Demo - Sin datos en BD" },
             { id: 992, name: "Tacos El Güero (Demo)", type: "Mexicana", rating: 4.6, priceLevel: "$", description: "Los mejores tacos al pastor", lat: 21.2842, lng: -89.6547, reason: "Demo - Sin datos en BD" }
          ];
        }
      },
      error: (err) => {
        console.error('Error fetching restaurants', err);
      }
    });
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
    // Navigate to Map with the recommended restaurants so they can be plotted
    this.router.navigate(['/map'], {
      state: {
        restaurants: this.recommendedRestaurants
      }
    });
  }
}
