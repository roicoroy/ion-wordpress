import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertController = inject(AlertController);
  
  private router = inject(Router);

  async presentSimpleAlert(
    // header: string,
    // subHeader: string,
    message: string,
    navigateTo: string,
  ) {
    const alertButtons = [
      {
        text: 'OK',
        role: 'confirm',
        htmlAttributes: {
          'aria-label': 'confirm',
        },
        handler: () => {
          this.router.navigateByUrl(navigateTo);
        },
      },
    ];
    const alert = await this.alertController.create({
      // header,
      // subHeader,
      message,
      buttons: alertButtons,
    });

    await alert.present();
  }

}
