import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  tipo?: string;
  type?: string;
  rating: number;
  priceLevel: string;
  distance?: string; // Optativo por ahora, calculable luego
  description: string;
  lat: number;
  lng: number;
  image?: string;
}

import { RestaurantService } from '../../services/restaurant';

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
  
  showPollyTip = true;
  pollyMessage = '¡Toca un marcador en el mapa para ver los detalles del lugar!';

  restaurants: Restaurant[] = [];
  map: L.Map | undefined;
  markers: L.Marker[] = [];
  
  // Navigation properties
  isNavigating = false;
  userLocation: L.LatLng | null = null;
  userMarker: L.Marker | null = null;
  routeLine: L.Polyline | null = null;

  // Default Leaflet icon path fix for Angular
  customIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(
    private router: Router, 
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef
  ) {
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
    if (this.restaurants.length === 0) {
      this.loadRestaurantsFromApi();
    }
  }

  loadRestaurantsFromApi() {
    this.restaurantService.getRestaurants().subscribe({
      next: (data: any[]) => {
        const filtered = data.filter(r => r.estado !== 'blocked');
        this.restaurants = filtered.map(r => ({
          id: r.id,
          name: r.nombre,
          type: r.categoria || 'Variado',
          rating: Number(r.rating_promedio) || 5.0,
          priceLevel: r.nivel_precio || '$$',
          description: r.direccion || 'Excelente lugar para disfrutar.',
          lat: Number(r.latitud),
          lng: Number(r.longitud),
        }));
        // Si el mapa ya se inicializó con el demo, re-agregamos los markers y centramos
        if (this.map) {
          this.addMarkersToMap();
          this.centerOnUser();
        }
      },
      error: (err: any) => {
        console.error('Error fetching restaurants', err);
      }
    });
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

<<<<<<< HEAD
  getMarkerIcon(tipo: string) {
    let color = '#ea4335'; // Red for Restaurante
    if (tipo === 'Hotel') color = '#4285f4'; // Blue
    if (tipo === 'Zona Turística') color = '#34a853'; // Green
    
    // SVG Marker
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="30px" height="30px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: svgIcon,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  }

  addMarkersToMap() {
    if (!this.map) return;
=======
  getUserLocation(): Promise<L.LatLng> {
    console.log('Solicitando ubicación actual...');
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolocalización no soportada por el navegador');
        reject('Geolocation not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
          console.log('Ubicación obtenida:', latlng);
          this.userLocation = latlng;
          resolve(latlng);
        },
        (err) => {
          console.error('Error de geolocalización:', err);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }
>>>>>>> d8c554d65427eb22383a6f575e6a28b8cec010f2

  async updateLocationMarker() {
    if (!this.map) return;
    try {
      const latlng = await this.getUserLocation();
      if (this.userMarker) {
        this.userMarker.setLatLng(latlng);
      } else {
        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: '<div class="pulse"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        this.userMarker = L.marker(latlng, { icon: userIcon }).addTo(this.map);
      }
    } catch (e) {
      console.error('Error updating location', e);
    }
  }

  addMarkersToMap() {
    if (!this.map) {
      console.warn('Mapa no inicializado aún');
      return;
    }

    console.log('--- addMarkersToMap ---');
    console.log('Estado - Navigating:', this.isNavigating);
    console.log('Estado - Selected:', this.selectedRestaurant?.name);

    // 1. Limpiar marcadores previos
    this.markers.forEach(m => m.remove());
    this.markers = [];

    // 2. Determinar qué restaurantes mostrar
    const displayList = this.isNavigating && this.selectedRestaurant 
      ? [this.selectedRestaurant] 
      : this.restaurants;

    console.log(`Dibujando ${displayList.length} marcadores en el mapa.`);

    // 3. Crear nuevos marcadores
    displayList.forEach(restaurant => {
      if (!restaurant.lat || !restaurant.lng) return;

<<<<<<< HEAD
      const placeType = restaurant.tipo || restaurant.type || 'Restaurante';

      const marker = L.marker([Number(restaurant.lat), Number(restaurant.lng)], {
        icon: this.getMarkerIcon(placeType)
      }).addTo(this.map!);

      // Popup
      marker.bindPopup(`<b>${restaurant.name}</b><br>${placeType}`);

      // Interactivity
      marker.on('click', () => {
        // Need to run inside Angular Zone manually or just let ng zone pick it up (click event is outside)
        this.handleMarkerClick(restaurant);
      });

=======
      const marker = L.marker([restaurant.lat, restaurant.lng], {
        icon: this.customIcon
      }).addTo(this.map!);

      marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.type}`);
      marker.on('click', () => this.handleMarkerClick(restaurant));
>>>>>>> d8c554d65427eb22383a6f575e6a28b8cec010f2
      this.markers.push(marker);
    });

    // 4. Actualizar marcador de usuario (siempre visible)
    this.updateLocationMarker();
  }

  handleMarkerClick(restaurant: Restaurant) {
    this.selectedRestaurant = restaurant;
    this.showBottomSheet = true;
    
    // Polly interacts based on selection
    if (restaurant.name) {
      this.pollyMessage = `¡Excelente elección! "${restaurant.name}" es un gran lugar.`;
      this.showPollyTip = true;
    }
  }

  togglePollyTip() {
    this.showPollyTip = !this.showPollyTip;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.showMenu = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.showFilters = false;
  }

  async centerOnUser() {
    console.log('Centering on user');
    if (!this.map) return;
    
    try {
      const latlng = await this.getUserLocation();
      this.map.setView(latlng, 15);
      this.updateLocationMarker();
    } catch (e) {
      console.warn('Geolocation failed, falling back to first restaurant', e);
      if (this.restaurants.length > 0) {
        const first = this.restaurants[0];
        if (first.lat && first.lng) {
          this.map.setView([Number(first.lat), Number(first.lng)], 15);
        }
      }
    }
  }

  async startNavigation() {
    console.log('>>> START NAVIGATION <<<');
    if (!this.selectedRestaurant || !this.map) {
      console.error('Navegación fallida: Sin restaurante seleccionado o sin mapa');
      return;
    }
    
    // Activar modo navegación
    this.isNavigating = true;
    this.cdr.detectChanges();
    
    // Forzar actualización inmediata de marcadores
    this.addMarkersToMap();
    
    try {
      this.map.invalidateSize();
      // Intentar obtener ubicación
      const userPos = await this.getUserLocation();
      const destPos = L.latLng(this.selectedRestaurant.lat, this.selectedRestaurant.lng);
      
      console.log(`Calculando ruta desde [${userPos.lat}, ${userPos.lng}] hasta [${destPos.lat}, ${destPos.lng}]`);

      // 1. Limpiar ruta anterior
      if (this.routeLine) {
        this.routeLine.remove();
        this.routeLine = null;
      }

      // 2. Trazar línea recta inicial como respaldo
      this.routeLine = L.polyline([userPos, destPos], {
        color: '#10b981',
        weight: 4,
        dashArray: '5, 10',
        opacity: 0.5
      }).addTo(this.map);

      // 3. Solicitar ruta real a OSRM
      const url = `https://router.project-osrm.org/route/v1/walking/${userPos.lng},${userPos.lat};${destPos.lng},${destPos.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        console.log('Ruta recibida exitosamente de OSRM');
        const coordinates = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
        
        // Reemplazar línea de respaldo con ruta real
        this.routeLine.setLatLngs(coordinates);
        this.routeLine.setStyle({ dashArray: '', opacity: 0.8, weight: 6 });
        
        // Ajustar vista para incluir ambos puntos
        const bounds = L.latLngBounds([userPos, destPos]);
        this.map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        console.warn('OSRM no devolvió rutas, se mantiene línea de respaldo');
        this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
      }
    } catch (e) {
      console.error('Error total en navegación:', e);
      // Al menos intentar centrar en el restaurante si todo falla
      this.map.setView([this.selectedRestaurant.lat, this.selectedRestaurant.lng], 15);
    }
  }

  cancelNavigation() {
    this.isNavigating = false;
    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }
    this.addMarkersToMap();
    if (this.selectedRestaurant) {
      this.map?.setView([this.selectedRestaurant.lat, this.selectedRestaurant.lng], 15);
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
