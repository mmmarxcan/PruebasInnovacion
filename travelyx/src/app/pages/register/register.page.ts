import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonIcon, IonInput, IonFabButton, IonLabel, IonText, IonRow, IonCol } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, personOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonIcon, IonInput, IonFabButton, IonLabel, IonText, IonRow, IonCol
  ]
})
export class RegisterPage implements OnInit {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, personOutline, arrowBackOutline });
  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

  register() {
    if (this.name && this.email && this.password && this.password === this.confirmPassword) {
      console.log('Registering:', this.name, this.email);
      // TODO: Implement registration
      this.router.navigateByUrl('/preferences');
    } else {
      console.log('Validation failed');
    }
  }
}
