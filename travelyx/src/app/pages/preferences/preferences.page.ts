import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  standalone: true,
  imports: [IonLabel, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonButton,
    IonList,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule
  ]
})
export class PreferencesPage {

  preferences = {
    foodType: '',
    budget: '',
    placeType: '',
  };

  constructor(private router: Router) {}

  savePreferences() {
    localStorage.setItem('travelyx_preferences', JSON.stringify(this.preferences));
    console.log('Preferencias guardadas:', this.preferences);
    this.router.navigateByUrl('/home');
  }
}
