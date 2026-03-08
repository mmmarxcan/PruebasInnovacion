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
import { 
  pizzaOutline, storefrontOutline, addCircleOutline, logOutOutline, 
  sparklesOutline, listOutline, restaurantOutline, arrowForwardOutline 
} from 'ionicons/icons';
import { AuthService } from '../../../services/auth';
import { RestaurantService } from '../../../services/restaurant';
import { IonToggle } from '@ionic/angular/standalone';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon,
        IonText, IonToggle, CommonModule, FormsModule, RouterLink
    ]
})
export class DashboardPage implements OnInit {

    restaurantName = '';
    restaurantId: number | null = null;
    userName = '';
    
    // Status Logic
    isOpenedNow = false;
    manualCerrado = false;
    currentSchedule: any = null;
    isLoadingStatus = true;

    constructor(
        private authService: AuthService, 
        private router: Router,
        private restaurantService: RestaurantService
    ) {
        addIcons({ 
            pizzaOutline, storefrontOutline, addCircleOutline, logOutOutline, 
            sparklesOutline, listOutline, restaurantOutline, arrowForwardOutline 
        });
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
                this.loadRestaurantInfo(user.restaurant_id);
            } else {
                this.restaurantId = null;
            }
        } else {
            this.router.navigateByUrl('/login');
        }
    }

    loadRestaurantInfo(id: number) {
        this.isLoadingStatus = true;
        // 1. Load basic info (including manual_cerrado)
        this.restaurantService.getRestaurantById(id).subscribe(data => {
            this.restaurantName = data.nombre;
            this.manualCerrado = data.manual_cerrado;
            
            // 2. Load schedules
            this.restaurantService.getSchedules(id).subscribe(schedules => {
                this.calculateStatus(schedules);
                this.isLoadingStatus = false;
            });
        });
    }

    calculateStatus(schedules: any[]) {
        if (this.manualCerrado) {
            this.isOpenedNow = false;
            return;
        }

        const now = new Date();
        const day = now.getDay(); // 0-6
        const timeStr = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

        const todaySchedule = schedules.find(s => s.dia_semana === day);
        if (!todaySchedule || todaySchedule.cerrado) {
            this.isOpenedNow = false;
            this.currentSchedule = null;
        } else {
            const isOpen = timeStr >= todaySchedule.apertura && timeStr <= todaySchedule.cierre;
            this.isOpenedNow = isOpen;
            this.currentSchedule = todaySchedule;
        }
    }

    toggleManualStatus(event: any) {
        const isCerradoManual = event.detail.checked;
        if (this.restaurantId) {
            // Update only manual_cerrado
            this.restaurantService.getRestaurantById(this.restaurantId).subscribe(data => {
                const updatedData = { ...data, manual_cerrado: isCerradoManual };
                this.restaurantService.updateRestaurant(this.restaurantId!, updatedData).subscribe(() => {
                    this.manualCerrado = isCerradoManual;
                    this.loadRestaurantInfo(this.restaurantId!); // Refresh logic
                });
            });
        }
    }

    createRestaurant() {
        this.router.navigateByUrl('/admin/restaurant-form');
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/welcome');
    }

}
