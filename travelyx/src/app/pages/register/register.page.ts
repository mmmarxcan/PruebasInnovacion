import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
  IonInput, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
    IonInput, IonButton, IonIcon, IonSpinner,
    CommonModule, FormsModule, RouterLink
  ]
})
export class RegisterPage implements OnInit {

  user = {
    nombre: '',
    email: '',
    password: ''
  };
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    if (!this.user.nombre || !this.user.email || !this.user.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert('Registro exitoso. Por favor inicia sesión.');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error registro:', err);
        if (err.status === 409) {
          alert('El usuario ya existe.');
        } else {
          alert('Error al registrar usuario.');
        }
      }
    });
  }

}
