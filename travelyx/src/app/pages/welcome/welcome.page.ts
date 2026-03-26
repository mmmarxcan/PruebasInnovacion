import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, storefrontOutline, restaurantOutline, bedOutline, mapOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
    standalone: true,
    imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class WelcomePage implements OnInit {

    pollyPhrases = [
        "¡Hola! Soy Polly. ¿Qué te gustaría visitar hoy? 🐙",
        "¡El clima en Progreso está increíble para salir! ☀️",
        "Tengo mucha hambre... ¡Vamos por un ceviche! 🍤",
        "¿Sabías que nuestro malecón es uno de los más largos del mundo? 🌊",
        "¡Toca una categoría para empezar la aventura! 🚀"
    ];
    currentPhrase = this.pollyPhrases[0];

    constructor(private router: Router) {
        addIcons({ arrowForwardOutline, storefrontOutline, restaurantOutline, bedOutline, mapOutline, arrowBackOutline });
    }

    ngOnInit() {
    }

    pokePolly() {
        let newPhrase = this.currentPhrase;
        while(newPhrase === this.currentPhrase) {
           newPhrase = this.pollyPhrases[Math.floor(Math.random() * this.pollyPhrases.length)];
        }
        this.currentPhrase = newPhrase;
    }

    selectPlaceContext(type: string) {
        if (type === 'Restaurante') {
            this.router.navigateByUrl('/preferences');
        } else {
            this.router.navigate(['/home'], {
                state: {
                    preferences: { place: type }
                }
            });
        }
    }

    goToAdminLogin() {
        this.router.navigateByUrl('/login');
    }

}
