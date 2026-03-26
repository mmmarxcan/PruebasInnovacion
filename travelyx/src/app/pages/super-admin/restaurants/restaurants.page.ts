import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonAvatar, IonBadge, IonButton, IonIcon, IonSearchbar, IonButtons, IonBackButton,
    IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular/standalone';
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
        IonSegment, IonSegmentButton, CommonModule, FormsModule
    ]
})
export class SuperAdminRestaurantsPage implements OnInit {

    filteredRestaurants: any[] = [];
    restaurants: any[] = [];
    selectedSegment = 'active';
    searchQuery = '';

    constructor(
        private superAdminService: SuperAdminService,
        private alertController: AlertController
    ) {
        addIcons({ checkmarkCircleOutline, banOutline, ellipsisVerticalOutline, searchOutline });
    }

    ngOnInit() {
        this.loadRestaurants();
    }

    loadRestaurants() {
        this.superAdminService.getRestaurants().subscribe({
            next: (data) => {
                this.restaurants = data;
                this.applyFilters();
            },
            error: (err) => console.error(err)
        });
    }

    onSegmentChange() {
        this.applyFilters();
    }

    filterList(event: any) {
        this.searchQuery = event.target.value.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredRestaurants = this.restaurants.filter(r => {
            const matchesStatus = r.estado === this.selectedSegment;
            const matchesSearch = r.nombre.toLowerCase().includes(this.searchQuery);
            return matchesStatus && matchesSearch;
        });
    }

    async updateStatus(restaurant: any, newStatus: string) {
        const actionLabel = newStatus === 'active' ? 'Activar' : (newStatus === 'inactive' ? 'Desactivar' : 'Actualizar');
        
        const alert = await this.alertController.create({
            header: 'Confirmar Acción',
            message: `¿Estás seguro de que deseas ${actionLabel.toLowerCase()} el restaurante "${restaurant.nombre}"?`,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: actionLabel,
                    handler: () => {
                        this.processStatusUpdate(restaurant, newStatus);
                    }
                }
            ]
        });

        await alert.present();
    }

    private processStatusUpdate(restaurant: any, newStatus: string) {
        console.log('📌 Intentando cambiar estado:', { id: restaurant.id, current: restaurant.estado, target: newStatus });
        this.superAdminService.updateRestaurantStatus(restaurant.id, newStatus).subscribe({
            next: (resp) => {
                console.log('✅ Cambio de estado exitoso en servidor:', resp);
                restaurant.estado = newStatus;
                this.applyFilters();
            },
            error: (err) => {
                console.error('❌ Error al cambiar estado:', err);
            }
        });
    }

}
