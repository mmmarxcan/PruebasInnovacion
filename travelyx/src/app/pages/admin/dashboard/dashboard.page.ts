import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon,
    IonText
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { pizzaOutline, storefrontOutline, addCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon,
        CommonModule, FormsModule, RouterLink
    ]
})
export class DashboardPage implements OnInit {

    restaurantName = '';
    restaurantId: number | null = null;
    userName = '';

    constructor(private authService: AuthService, private router: Router) {
        addIcons({ pizzaOutline, storefrontOutline, addCircleOutline });
    }

    ngOnInit() {
        this.loadUser();
    }

    loadUser() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.userName = user.nombre;
            if (user.restaurant_id) {
                this.restaurantId = user.restaurant_id;
                this.restaurantName = 'Tu Restaurante'; // Podríamos hacer fetch para el nombre real
            } else {
                this.restaurantId = null;
            }
        } else {
            this.router.navigateByUrl('/login');
        }
    }

    createRestaurant() {
        this.router.navigateByUrl('/admin/restaurant-form');
    }

}
