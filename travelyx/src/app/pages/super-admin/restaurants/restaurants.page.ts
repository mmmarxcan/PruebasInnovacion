import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../services/restaurant';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonAvatar, IonBadge, IonButton, IonIcon, IonSearchbar, IonButtons, IonBackButton,
    IonActionSheet
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, banOutline, ellipsisVerticalOutline, searchOutline } from 'ionicons/icons';

@Component({
    selector: 'app-super-admin-restaurants',
    templateUrl: './restaurants.page.html',
    styleUrls: ['./restaurants.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
        IonAvatar, IonBadge, IonButton, IonIcon, IonSearchbar, IonButtons, IonBackButton,
        IonActionSheet, CommonModule, FormsModule
    ]
})
export class SuperAdminRestaurantsPage implements OnInit {

    filteredRestaurants: any[] = [];
    restaurants: any[] = [];
    isActionSheetOpen = false;
    selectedRestaurant: any = null;

    public actionSheetButtons = [
        {
            text: 'Aprobar',
            role: 'destructive',
            data: {
                action: 'approve',
            },
        },
        {
            text: 'Bloquear',
            data: {
                action: 'block',
            },
        },
        {
            text: 'Cancelar',
            role: 'cancel',
            data: {
                action: 'cancel',
            },
        },
    ];

    constructor(private restaurantService: RestaurantService) {
        addIcons({ checkmarkCircleOutline, banOutline, ellipsisVerticalOutline, searchOutline });
    }

    ngOnInit() {
        this.loadRestaurants();
    }

    loadRestaurants() {
        this.restaurantService.getRestaurants().subscribe(data => {
            this.restaurants = data;
            this.filteredRestaurants = [...this.restaurants];
        });
    }

    filterList(event: any) {
        const query = event.target.value.toLowerCase();
        this.filteredRestaurants = this.restaurants.filter(r => r.name.toLowerCase().includes(query));
    }

    setOpen(isOpen: boolean, restaurant?: any) {
        this.isActionSheetOpen = isOpen;
        if (restaurant) {
            this.selectedRestaurant = restaurant;
        }
    }

    handleAction(event: any) {
        const action = event.detail.data?.action;
        if (action === 'approve' && this.selectedRestaurant) {
            this.selectedRestaurant.status = 'active';
        } else if (action === 'block' && this.selectedRestaurant) {
            this.selectedRestaurant.status = 'blocked';
        }
        this.setOpen(false);
    }

}
