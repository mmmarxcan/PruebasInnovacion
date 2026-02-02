import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonIcon, IonInput, IonFabButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonFabButton, 
    IonButton,
    IonItem,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  loginWithEmail() {
    if (this.email && this.password) {
      console.log('Login con email:', this.email);
      this.router.navigateByUrl('/preferences');
    } else {
      alert('Por favor ingrese email y contraseña');
    }
  }

  loginWithGoogle() {
    console.log('Login con Google');
    this.router.navigateByUrl('/preferences');
  }
}
