import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol,
    IonIcon, IonButton, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { restaurantOutline, timeOutline, peopleOutline, listOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';

import { SuperAdminService } from '../../../services/super-admin';

@Component({
    selector: 'app-super-admin-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
        IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol,
        IonIcon, IonButton, IonButtons, IonBackButton, CommonModule, FormsModule, RouterLink
    ]
})
export class SuperAdminDashboardPage {

    stats = {
        activeRestaurants: 0,
        inactiveRestaurants: 0,
        pendingRequests: 0,
        activeUsers: 0
    };

    constructor(private router: Router, private superAdminService: SuperAdminService) {
        addIcons({ restaurantOutline, timeOutline, peopleOutline, listOutline });
    }

    ionViewWillEnter() {
        this.loadStats();
    }

    loadStats() {
        this.superAdminService.getStats().subscribe({
            next: (data) => {
                this.stats = data;
            },
            error: (err) => console.error(err)
        });
    }
}
