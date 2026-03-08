import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonThumbnail, IonButton, IonIcon, IonButtons, IonBackButton, IonFab, IonFabButton,
  IonModal, IonItemDivider, IonInput, IonTextarea, IonSelect, IonSelectOption, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, pizzaOutline, createOutline, cloudUploadOutline } from 'ionicons/icons';
import { RestaurantService } from '../../../services/restaurant';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonThumbnail, IonButton, IonIcon, IonButtons, IonBackButton, IonFab, IonFabButton,
    IonModal, IonItemDivider, IonInput, IonTextarea, IonSelect, IonSelectOption, IonSpinner,
    CommonModule, FormsModule
  ]
})
export class MenuPage implements OnInit {

  restaurantId: number | null = null;
  dishes: any[] = [];
  isLoading = false;

  isModalOpen = false;
  isEditMode = false;
  currentDishId: number | null = null;

  dishForm = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'Principal',
    foto_url: ''
  };

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService
  ) {
    addIcons({ addOutline, trashOutline, pizzaOutline, createOutline, cloudUploadOutline });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    console.log('📌 MenuPage ngOnInit - User:', user);
    if (user && user.restaurant_id) {
      this.restaurantId = user.restaurant_id;
      this.loadMenu();
    } else {
      console.warn('⚠️ No restaurant_id found for current user');
    }
  }

  loadMenu() {
    if (!this.restaurantId) return;
    this.isLoading = true;
    this.restaurantService.getMenu(this.restaurantId).subscribe({
      next: (data) => {
        this.dishes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentDishId = null;
    this.dishForm = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: 'Principal',
      foto_url: ''
    };
    this.setOpen(true);
  }

  openEditModal(dish: any) {
    this.isEditMode = true;
    this.currentDishId = dish.id;
    this.dishForm = {
      nombre: dish.nombre,
      descripcion: dish.descripcion,
      precio: dish.precio,
      categoria: dish.categoria,
      foto_url: dish.foto_url
    };
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.restaurantService.uploadImage(file).subscribe({
        next: (res: any) => {
          this.dishForm.foto_url = res.url;
        },
        error: (err) => {
          console.error(err);
          alert('Error al subir imagen');
        }
      });
    }
  }

  saveDish() {
    console.log('📌 saveDish clicked. Form Data:', this.dishForm);
    console.log('📌 Current restaurantId:', this.restaurantId);

    // Validation fix: Allow 0 as a valid price if needed, or at least check properly
    if (!this.dishForm.nombre || this.dishForm.precio === null || this.dishForm.precio === undefined || !this.restaurantId) {
      alert('Nombre, precio e ID de restaurante son obligatorios');
      return;
    }

    if (this.isEditMode && this.currentDishId) {
      console.log('📌 Updating dish:', this.currentDishId);
      this.restaurantService.updateDish(this.currentDishId, this.dishForm).subscribe({
        next: () => {
          console.log('✅ Dish updated successfully');
          this.loadMenu();
          this.setOpen(false);
        },
        error: (err) => console.error('❌ Error updating dish:', err)
      });
    } else {
      console.log('📌 Adding new dish');
      const data = { ...this.dishForm, restaurant_id: this.restaurantId };
      this.restaurantService.addDish(data).subscribe({
        next: () => {
          console.log('✅ Dish added successfully');
          this.loadMenu();
          this.setOpen(false);
        },
        error: (err) => console.error('❌ Error adding dish:', err)
      });
    }
  }

  deleteDish(id: number) {
    if (confirm('¿Estás seguro de eliminar este platillo?')) {
      this.restaurantService.deleteDish(id).subscribe(() => {
        this.loadMenu();
      });
    }
  }

}
