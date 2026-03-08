import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trendingUpOutline, peopleOutline, timeOutline } from 'ionicons/icons';
import { RestaurantService } from '../../../services/restaurant';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.page.html',
    styleUrls: ['./analytics.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSpinner, CommonModule, FormsModule]
})
export class AnalyticsPage implements OnInit {

    weeklyViews: any[] = [];
    interactionRate = 0;
    totalDishes = 0;
    isLoading = false;

    constructor(
        private router: Router, 
        private restaurantService: RestaurantService,
        private authService: AuthService
    ) {
        addIcons({ arrowBackOutline, trendingUpOutline, peopleOutline, timeOutline });
    }

    ngOnInit() {
        this.loadAnalytics();
    }

    loadAnalytics() {
        const user = this.authService.getCurrentUser();
        if (user && user.restaurant_id) {
            this.isLoading = true;
            this.restaurantService.getAnalytics(user.restaurant_id).subscribe({
                next: (data) => {
                    this.weeklyViews = data.weeklyViews;
                    this.interactionRate = data.interactionRate;
                    this.totalDishes = data.totalDishes;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                }
            });
        }
    }

    goBack() {
        this.router.navigateByUrl('/admin/dashboard');
    }

    getBarHeight(value: number): string {
        const max = 150; // We can adjust this based on actual data
        const percentage = (value / max) * 100;
        return `${percentage}%`;
    }

}
