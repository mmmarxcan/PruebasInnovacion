import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonToggle, IonList
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, saveOutline, cloudOutline, cloudUploadOutline, trashOutline, addOutline } from 'ionicons/icons';
import { RestaurantService } from '../../../services/restaurant';
import { AuthService } from '../../../services/auth';
import * as L from 'leaflet';

@Component({
    selector: 'app-restaurant-form',
    templateUrl: './restaurant-form.page.html',
    styleUrls: ['./restaurant-form.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
        IonToggle, IonList, CommonModule, FormsModule
    ]
})
export class RestaurantFormPage implements OnInit {

    map: L.Map | undefined;
    marker: L.Marker | undefined;

    restaurant = {
        nombre: '',
        categoria: 'Restaurante',
        direccion: '',
        telefono: '',
        website: '',
        foto_portada: '',
        latitud: '21.2829', // Default Progreso center aprox
        longitud: '-89.6644',
        tipo: 'Restaurante'
    };

    isEditMode = false;
    
    // New Features
    schedules: any[] = [];
    gallery: any[] = [];
    daysOfWeek = [
        { id: 0, name: 'Domingo' },
        { id: 1, name: 'Lunes' },
        { id: 2, name: 'Martes' },
        { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' },
        { id: 5, name: 'Viernes' },
        { id: 6, name: 'Sábado' }
    ];

    categories = [
        'Seafood',
        'General Restaurant',
        'Latin American / Mexican',
        'Breakfast / Bakery',
        'American / Burgers',
        'Italian / Pizzeria',
        'Caribbean',
        'Asian',
        'Eastern European'
    ];

    constructor(
        private router: Router,
        private restaurantService: RestaurantService,
        private authService: AuthService
    ) {
        addIcons({ arrowBackOutline, saveOutline, cloudUploadOutline, trashOutline, addOutline });
    }

    ngOnInit() {
        // Init default schedules
        this.schedules = this.daysOfWeek.map(day => ({
            dia_semana: day.id,
            apertura: '09:00',
            cierre: '22:00',
            cerrado: false
        }));

        const user = this.authService.getCurrentUser();
        if (user && user.restaurant_id) {
            this.isEditMode = true;
            this.loadRestaurant(user.restaurant_id);
            this.loadExtraData(user.restaurant_id);
        }
    }

    ionViewDidEnter() {
        this.initMap();
    }

    initMap() {
        const lat = parseFloat(this.restaurant.latitud);
        const lng = parseFloat(this.restaurant.longitud);

        this.map = L.map('mapId').setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

        // Update when dragging marker
        this.marker.on('dragend', () => {
            const position = this.marker!.getLatLng();
            this.updateCoords(position.lat, position.lng);
        });

        // Update when clicking map
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            this.marker!.setLatLng([lat, lng]);
            this.updateCoords(lat, lng);
        });
    }

    updateCoords(lat: number, lng: number) {
        this.restaurant.latitud = lat.toFixed(6);
        this.restaurant.longitud = lng.toFixed(6);
    }

    loadRestaurant(id: number) {
        this.restaurantService.getRestaurantById(id).subscribe(data => {
            this.restaurant = data;
            if (this.map && this.marker) {
                const lat = parseFloat(this.restaurant.latitud);
                const lng = parseFloat(this.restaurant.longitud);
                if (this.map) this.map.setView([lat, lng], 15);
                if (this.marker) this.marker.setLatLng([lat, lng]);
            }
        });
    }

    loadExtraData(id: number) {
        this.restaurantService.getSchedules(id).subscribe(list => {
            if (list.length > 0) {
                // Map to our structure ensuring all days exist
                this.schedules = this.daysOfWeek.map(day => {
                    const existing = list.find(s => s.dia_semana === day.id);
                    return existing || { dia_semana: day.id, apertura: '09:00', cierre: '22:00', cerrado: true };
                });
            }
        });

        this.restaurantService.getGallery(id).subscribe(list => {
            this.gallery = list;
        });
    }

    onFileSelected(event: any, field: 'cover' | 'gallery') {
        const file = event.target.files[0];
        if (file) {
            this.restaurantService.uploadImage(file).subscribe({
                next: (res: any) => {
                    if (field === 'cover') {
                        this.restaurant.foto_portada = res.url;
                    } else if (field === 'gallery' && this.isEditMode) {
                        const user = this.authService.getCurrentUser();
                        this.restaurantService.addToGallery(user.restaurant_id, res.url).subscribe(() => {
                           this.loadExtraData(user.restaurant_id);
                        });
                    }
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al subir imagen');
                }
            });
        }
    }

    addPhotoToGallery(url: string) {
        const user = this.authService.getCurrentUser();
        if (user && user.restaurant_id) {
            this.restaurantService.addToGallery(user.restaurant_id, url).subscribe(() => {
                this.loadExtraData(user.restaurant_id);
            });
        }
    }

    deletePhoto(id: number) {
        this.restaurantService.deleteFromGallery(id).subscribe(() => {
            const user = this.authService.getCurrentUser();
            if (user && user.restaurant_id) this.loadExtraData(user.restaurant_id);
        });
    }

    saveRestaurant() {
        const user = this.authService.getCurrentUser();
        if (!user) {
            alert('Debes iniciar sesión.');
            return;
        }

        if (!this.restaurant.nombre || !this.restaurant.direccion) {
            alert('Nombre y Dirección son obligatorios.');
            return;
        }

        if (this.isEditMode) {
            // Update
            this.restaurantService.updateRestaurant(user.restaurant_id, this.restaurant).subscribe({
                next: () => {
                    // Also update schedules
                    this.restaurantService.updateSchedules(user.restaurant_id, this.schedules).subscribe(() => {
                        alert('Datos y horarios actualizados');
                        this.router.navigateByUrl('/admin/dashboard');
                    });
                },
                error: (err) => console.error(err)
            });
        } else {
            // Create
            const newRestaurant = { ...this.restaurant, user_id: user.id };
            this.restaurantService.createRestaurant(newRestaurant).subscribe({
                next: (res: any) => {
                    const rid = res.restaurantId;
                    // Save initial schedules
                    this.restaurantService.updateSchedules(rid, this.schedules).subscribe(() => {
                        alert('Restaurante creado con éxito!');
                        // Update local session
                        const updatedUser = { ...user, restaurant_id: rid };
                        localStorage.setItem('travelyx_user', JSON.stringify(updatedUser)); 
                        this.router.navigateByUrl('/admin/dashboard');
                    });
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al crear restaurante');
                }
            });
        }
    }

    cancel() {
        this.router.navigateByUrl('/admin/dashboard');
    }

}
