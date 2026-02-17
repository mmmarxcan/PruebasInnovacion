import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-super-admin-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
        IonCardTitle, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol,
        IonIcon, IonButton, IonButtons, IonBackButton, CommonModule, FormsModule, RouterLink
    ]
})
export class SuperAdminDashboardPage implements OnInit {

    // Mock data for dashboard
    stats = {
        totalRestaurants: 45,
        pendingRequests: 8,
        activeUsers: 1240
    };

    constructor(private router: Router) {
        addIcons({ restaurantOutline, timeOutline, peopleOutline, listOutline });
    }

    ngOnInit() {
    }
}
