import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingController = inject(LoadingController);

  // Simple loader
  async simpleLoader() {
    await this.loadingController.create({
      message: 'Loading...'
    }).then((response) => {
      response.present();
    });
  }
  
  // Dismiss loader
  async dismissLoader() {
    await this.loadingController.dismiss().then((response) => {
    }).catch((err) => {
      console.log('Error occured : ', err);
    });
  }
  
  // Auto hide show loader
  async autoLoader(timeCouter: number) {
    await this.loadingController.create({
      message: 'Loader hides after 4 seconds',
      duration: timeCouter,
    }).then((response) => {
      response.present();
      response.onDidDismiss().then((response) => {
        console.log('Loader dismissed', response);
      });
    });
  }

  // Custom style + hide on tap loader
  async customLoader() {
    await this.loadingController.create({
      message: 'Loader with custom style',
      duration: 4000,
      cssClass: 'loader-css-class',
      backdropDismiss: true
    }).then((res) => {
      res.present();
    });
  }
}
