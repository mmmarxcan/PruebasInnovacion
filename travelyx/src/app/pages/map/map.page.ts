import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  map!: L.Map;

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    if (!this.map) {
      this.initMap();
      this.loadRestaurants();
    } else {
      this.map.invalidateSize();
    }
  }

  initMap() {
    this.map = L.map('map').setView([21.2833, -89.665], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadRestaurants() {
    const url = 'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Bnode%5B%22amenity%22%3D%22restaurant%22%5D%28around%3A5000%2C21%2E2833%2C%2D89%2E665%29%3Bout%3B';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        data.elements.forEach((place: any) => {
          if (place.lat && place.lon) {
            L.marker([place.lat, place.lon])
              .addTo(this.map)
              .bindPopup(place.tags?.name || 'Restaurante sin nombre');
          }
        });
      })
      .catch(err => console.error('Error cargando lugares:', err));
  }
}
