import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { IonContent, IonButton, IonIcon, IonInput, IonText } from '@ionic/angular/standalone';
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
    IonContent, IonButton, IonIcon, IonInput, IonText
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle });
  }

  ngOnInit() { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginWithEmail() {
    if (this.email && this.password) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (user) => {
          console.log('Login exitoso:', user);
          if (user.rol === 'SUPER_ADMIN') {
            this.router.navigateByUrl('/super-admin/dashboard');
          } else {
            this.router.navigateByUrl('/admin/dashboard');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          if (err.status === 0) {
            alert('No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo.');
          } else if (err.status === 404) {
            alert('Usuario no encontrado o contraseña incorrecta.');
          } else {
            alert('Error al iniciar sesión. Intenta nuevamente.');
          }
        }
      });
    } else {
      alert('Por favor ingrese email y contraseña');
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
