import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonList, IonListHeader } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cameraOutline, saveOutline, restaurantOutline, fastFoodOutline, cashOutline, imageOutline } from 'ionicons/icons';

@Component({
    selector: 'app-restaurant-form',
    templateUrl: './restaurant-form.page.html',
    styleUrls: ['./restaurant-form.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonList, IonListHeader, CommonModule, FormsModule]
})
export class RestaurantFormPage implements OnInit {

    // Form Model
    restaurant = {
        name: '',
        description: '',
        address: '',
        type: [], // Multiple selection
        priceLevel: '',
        placeType: [], // Multiple
        coverImage: '',
        dishImage: '',
        dishName: '',
        dishPrice: null
    };

    foodTypes = [
        { id: 'italian', label: 'Italiana' },
        { id: 'mexican', label: 'Mexicana' },
        { id: 'asian', label: 'Asiática' },
        { id: 'vegetarian', label: 'Vegetariana' },
        { id: 'cafe', label: 'Café' },
        { id: 'dessert', label: 'Postres' },
    ];

    placeTypes = [
        { id: 'casual', label: 'Casual' },
        { id: 'formal', label: 'Formal' },
        { id: 'bar', label: 'Bar/Pub' },
        { id: 'familyfriendly', label: 'Familiar' },
    ];

    constructor(private router: Router) {
        addIcons({ arrowBackOutline, cameraOutline, saveOutline, restaurantOutline, fastFoodOutline, cashOutline, imageOutline });
    }

    ngOnInit() {
    }

    saveRestaurant() {
        console.log('Saving restaurant:', this.restaurant);
        // Logic to save would go here (Service call)
        this.router.navigateByUrl('/admin/dashboard');
    }

    cancel() {
        this.router.navigateByUrl('/admin/dashboard');
    }

}
