import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonThumbnail, IonFab, IonFabButton, IonCard, IonCardContent, IonChip } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, restaurantOutline, createOutline, trashOutline, statsChartOutline } from 'ionicons/icons';

interface Restaurant {
    id: number;
    name: string;
    type: string;
    image: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonThumbnail, IonFab, IonFabButton, IonCard, IonCardContent, IonChip, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

    // Mock data for initial state
    restaurants: Restaurant[] = [
        {
            id: 1,
            name: "Mi Restaurante Ejemplo",
            type: "Mexicana",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=60"
        }
    ];

    constructor(private router: Router) {
        addIcons({ add, logOutOutline, restaurantOutline, createOutline, trashOutline, statsChartOutline });
    }

    ngOnInit() {
    }

    goToAnalytics() {
        this.router.navigateByUrl('/admin/analytics');
    }

    addRestaurant() {
        this.router.navigateByUrl('/admin/restaurant-form');
    }

    editRestaurant(id: number) {
        console.log('Edit restaurant', id);
        // In a real app we would pass the ID
        this.router.navigateByUrl('/admin/restaurant-form');
    }

    deleteRestaurant(id: number) {
        console.log('Delete restaurant', id);
        this.restaurants = this.restaurants.filter(r => r.id !== id);
    }

    logout() {
        this.router.navigateByUrl('/welcome');
    }

}
