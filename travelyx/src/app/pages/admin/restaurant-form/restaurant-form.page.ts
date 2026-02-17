import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, saveOutline, cloudUploadOutline } from 'ionicons/icons';
import { RestaurantService } from '../../../services/restaurant';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-restaurant-form',
    templateUrl: './restaurant-form.page.html',
    styleUrls: ['./restaurant-form.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
        CommonModule, FormsModule
    ]
})
export class RestaurantFormPage implements OnInit {

    restaurant = {
        nombre: '',
        categoria: 'Restaurante',
        direccion: '',
        telefono: '',
        website: '',
        foto_portada: '',
        latitud: '21.2829', // Default Progreso center aprox
        longitud: '-89.6644'
    };

    isEditMode = false;

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
        addIcons({ arrowBackOutline, saveOutline, cloudUploadOutline });
    }

    ngOnInit() {
        // TODO: Detect navigation params for Edit Mode
        const user = this.authService.getCurrentUser();
        if (user && user.restaurant_id) {
            this.isEditMode = true;
            this.loadRestaurant(user.restaurant_id);
        }
    }

    loadRestaurant(id: number) {
        this.restaurantService.getRestaurantById(id).subscribe(data => {
            this.restaurant = data;
        });
    }

    onFileSelected(event: any, field: 'cover' | 'dish') {
        const file = event.target.files[0];
        if (file) {
            this.restaurantService.uploadImage(file).subscribe({
                next: (res: any) => {
                    if (field === 'cover') {
                        this.restaurant.foto_portada = res.url;
                    }
                    // Future expansion for dish image if needed in this form
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al subir imagen');
                }
            });
        }
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
                    alert('Datos actualizados');
                    this.router.navigateByUrl('/admin/dashboard');
                },
                error: (err) => console.error(err)
            });
        } else {
            // Create
            const newRestaurant = { ...this.restaurant, user_id: user.id };
            this.restaurantService.createRestaurant(newRestaurant).subscribe({
                next: (res: any) => {
                    alert('Restaurante creado con éxito!');
                    // Update local session
                    const updatedUser = { ...user, restaurant_id: res.restaurantId };
                    localStorage.setItem('travelyx_user', JSON.stringify(updatedUser)); // Use correct key from AuthService
                    this.router.navigateByUrl('/admin/dashboard');
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
