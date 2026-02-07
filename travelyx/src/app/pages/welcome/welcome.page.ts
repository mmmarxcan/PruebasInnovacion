import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, storefrontOutline } from 'ionicons/icons';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, CommonModule, FormsModule]
})
export class WelcomePage implements OnInit {

    constructor(private router: Router) {
        addIcons({ arrowForwardOutline, storefrontOutline });
    }

    ngOnInit() {
    }

    startExperience() {
        this.router.navigateByUrl('/preferences');
    }

    goToAdminLogin() {
        this.router.navigateByUrl('/login');
    }

}
