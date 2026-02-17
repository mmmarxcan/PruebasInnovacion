import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonThumbnail, IonButton, IonIcon, IonButtons, IonBackButton, IonFab, IonFabButton,
  IonModal, IonItemDivider, IonInput, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, pizzaOutline } from 'ionicons/icons';
import { RestaurantService } from '../../../services/restaurant';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonThumbnail, IonButton, IonIcon, IonButtons, IonBackButton, IonFab, IonFabButton,
    IonModal, IonItemDivider, IonInput, IonTextarea, IonSelect, IonSelectOption,
    CommonModule, FormsModule
  ]
})
export class MenuPage implements OnInit {

  restaurantId = 1; // TODO: Obtener del usuario logueado
  dishes: any[] = [];

  isModalOpen = false;
  newDish = {
    restaurant_id: this.restaurantId,
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'Principal',
    foto_url: ''
  };

  constructor(private restaurantService: RestaurantService) {
    addIcons({ addOutline, trashOutline, pizzaOutline });
  }

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.restaurantService.getMenu(this.restaurantId).subscribe(data => {
      this.dishes = data;
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  saveDish() {
    // Validar datos básicos
    if (!this.newDish.nombre || !this.newDish.precio) return;

    this.restaurantService.addDish(this.newDish).subscribe(() => {
      this.loadMenu();
      this.setOpen(false);
      // Reset form
      this.newDish = {
        restaurant_id: this.restaurantId,
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: 'Principal',
        foto_url: ''
      };
    });
  }

  deleteDish(id: number) {
    this.restaurantService.deleteDish(id).subscribe(() => {
      this.loadMenu();
    });
  }

}
