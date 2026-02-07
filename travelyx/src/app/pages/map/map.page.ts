import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  optionsOutline,
  settingsOutline,
  logOutOutline,
  closeOutline,
  mapOutline,
  navigateOutline,
  star
} from 'ionicons/icons';

interface Restaurant {
  id: number;
  name: string;
  type: string;
  rating: number;
  priceLevel: string;
  distance: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  position: { top: string, left: string }; // Custom position for CSS map
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, CommonModule, FormsModule]
})
export class MapPage implements OnInit {
  selectedRestaurant: Restaurant | null = null;
  showFilters = false;
  showMenu = false;
  showBottomSheet = false;

  restaurants: Restaurant[] = [
    {
      id: 1,
      name: "La Trattoria Bella",
      type: "Italiana",
      rating: 4.8,
      priceLevel: "$$",
      distance: "0.5 km",
      address: "Calle Principal 123",
      lat: 40.7128,
      lng: -74.0060,
      image: "https://images.unsplash.com/photo-1722587561829-8a53e1935e20?auto=format&fit=crop&w=400&q=80",
      position: { top: '30%', left: '40%' }
    },
    {
      id: 2,
      name: "Tacos El Güero",
      type: "Mexicana",
      rating: 4.6,
      priceLevel: "$",
      distance: "0.8 km",
      address: "Av. Reforma 456",
      lat: 40.7138,
      lng: -74.0070,
      image: "https://images.unsplash.com/photo-1666307551254-eacbfaff5369?auto=format&fit=crop&w=400&q=80",
      position: { top: '50%', left: '60%' }
    },
    {
      id: 3,
      name: "Sushi Zen",
      type: "Asiática",
      rating: 4.9,
      priceLevel: "$$$",
      distance: "1.2 km",
      address: "Plaza Central 789",
      lat: 40.7118,
      lng: -74.0050,
      image: "https://images.unsplash.com/photo-1634881091116-1876b8c2b414?auto=format&fit=crop&w=400&q=80",
      position: { top: '45%', left: '25%' }
    },
    {
      id: 4,
      name: "Green Garden",
      type: "Vegetariana",
      rating: 4.7,
      priceLevel: "$$",
      distance: "0.3 km",
      address: "Paseo Verde 321",
      lat: 40.7148,
      lng: -74.0065,
      image: "https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?auto=format&fit=crop&w=400&q=80",
      position: { top: '65%', left: '45%' }
    },
    {
      id: 5,
      name: "Café Bohème",
      type: "Café",
      rating: 4.5,
      priceLevel: "$",
      distance: "0.6 km",
      address: "Calle Artista 654",
      lat: 40.7108,
      lng: -74.0055,
      image: "https://images.unsplash.com/photo-1739723745132-97df9db49db2?auto=format&fit=crop&w=400&q=80",
      position: { top: '35%', left: '70%' }
    },
    {
      id: 6,
      name: "Sweet Dreams",
      type: "Postres",
      rating: 4.9,
      priceLevel: "$$",
      distance: "1.0 km",
      address: "Boulevard Dulce 987",
      lat: 40.7158,
      lng: -74.0045,
      image: "https://images.unsplash.com/photo-1496890607984-d27fca8a68ad?auto=format&fit=crop&w=400&q=80",
      position: { top: '55%', left: '35%' }
    },
  ];

  constructor(private router: Router) {
    addIcons({
      locationOutline,
      optionsOutline,
      settingsOutline,
      logOutOutline,
      closeOutline,
      mapOutline,
      navigateOutline,
      star
    });
  }

  ngOnInit() {
  }

  handleMarkerClick(restaurant: Restaurant) {
    this.selectedRestaurant = restaurant;
    this.showBottomSheet = true;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.showMenu = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.showFilters = false;
  }

  centerOnUser() {
    console.log('Centering on user');
  }

  backToWelcome() {
    this.router.navigateByUrl('/welcome');
  }

  goToPreferences() {
    this.router.navigateByUrl('/preferences');
  }

  logout() {
    this.router.navigateByUrl('/login');
  }
}
