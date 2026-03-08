import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import * as L from 'leaflet';
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
  distance?: string; // Optativo por ahora, calculable luego
  description: string;
  lat: number;
  lng: number;
  image?: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, CommonModule, FormsModule]
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  selectedRestaurant: Restaurant | null = null;
  showFilters = false;
  showMenu = false;
  showBottomSheet = false;

  restaurants: Restaurant[] = [];
  map: L.Map | undefined;
  markers: L.Marker[] = [];

  // Default Leaflet icon path fix for Angular
  customIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

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
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['restaurants']) {
      this.restaurants = nav.extras.state['restaurants'];
      console.log('Map received restaurants:', this.restaurants);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    // Default to Progreso Coordinates if no restaurants
    let centerLat = 21.2842;
    let centerLng = -89.6547;
    let initialZoom = 13;

    if (this.restaurants.length > 0 && this.restaurants[0].lat && this.restaurants[0].lng) {
      centerLat = Number(this.restaurants[0].lat);
      centerLng = Number(this.restaurants[0].lng);
      initialZoom = 15;
    }

    this.map = L.map('leaflet-map', {
      zoomControl: false // Ocultamos el zoom por defecto para usar diseño custom si es necesario
    }).setView([centerLat, centerLng], initialZoom);

    // Add specific OSM Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Fix for Leaflet tile loading bug in Ionic/Angular life cycles
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 400);

    this.addMarkersToMap();
  }

  addMarkersToMap() {
    if (!this.map) return;

    this.restaurants.forEach(restaurant => {
      // Validate coordinates
      if (!restaurant.lat || !restaurant.lng) return;

      const marker = L.marker([Number(restaurant.lat), Number(restaurant.lng)], {
        icon: this.customIcon
      }).addTo(this.map!);

      // Popup
      marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.type}`);

      // Interactivity
      marker.on('click', () => {
        // Need to run inside Angular Zone manually or just let ng zone pick it up (click event is outside)
        this.handleMarkerClick(restaurant);
      });

      this.markers.push(marker);
    });
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
    if (this.map && this.restaurants.length > 0) {
      // Recenter Map based on first restaurant or keep it interactive
      const first = this.restaurants[0];
      if (first.lat && first.lng) {
        this.map.setView([Number(first.lat), Number(first.lng)], 15);
      }
    }
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
