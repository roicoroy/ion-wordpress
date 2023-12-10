import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PrivacyComponent } from 'src/app/components/privacy/privacy.component';
import { TermsOfServiceComponent } from 'src/app/components/terms-of-service/terms-of-service.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalController = inject(ModalController);
  
  private router = inject(Router);

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyComponent
    });
    return await modal.present();
  }
  
  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServiceComponent
    });
    return await modal.present();
  }

}
