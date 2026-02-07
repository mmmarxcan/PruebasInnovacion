import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trendingUpOutline, peopleOutline, timeOutline } from 'ionicons/icons';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.page.html',
    styleUrls: ['./analytics.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, CommonModule, FormsModule]
})
export class AnalyticsPage implements OnInit {

    // Mock Data for Charts
    weeklyViews = [
        { day: 'L', value: 45, label: 'Lun' },
        { day: 'M', value: 80, label: 'Mar' },
        { day: 'X', value: 65, label: 'Mié' },
        { day: 'J', value: 90, label: 'Jue' },
        { day: 'V', value: 120, label: 'Vie' },
        { day: 'S', value: 150, label: 'Sáb' },
        { day: 'D', value: 130, label: 'Dom' }
    ];

    interactionRate = 78; // %

    constructor(private router: Router) {
        addIcons({ arrowBackOutline, trendingUpOutline, peopleOutline, timeOutline });
    }

    ngOnInit() {
    }

    goBack() {
        this.router.navigateByUrl('/admin/dashboard');
    }

    // Helper to calculate bar height relative to max value (150 in this case)
    getBarHeight(value: number): string {
        const max = 150;
        const percentage = (value / max) * 100;
        return `${percentage}%`;
    }

}
