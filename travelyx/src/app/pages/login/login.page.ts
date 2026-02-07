import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonIcon, IonInput, IonFabButton, IonLabel, IonText, IonRow, IonCol } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonIcon, IonInput, IonFabButton, IonLabel, IonText, IonRow, IonCol
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword = false;

  constructor(private router: Router) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle });
  }

  ngOnInit() { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginWithEmail() {
    if (this.email && this.password) {
      console.log('Login con email:', this.email);
      // Admin login redirects to Dashboard
      this.router.navigateByUrl('/admin/dashboard');
    } else {
      console.log('Faltan credenciales');
      // For demo purposes, navigate anyway
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  loginWithGoogle() {
    console.log('Login con Google');
    this.router.navigateByUrl('/map');
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
