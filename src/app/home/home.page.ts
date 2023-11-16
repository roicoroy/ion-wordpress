import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Platform, IonMenu, ToastController, ToastButton, ModalController } from '@ionic/angular/standalone';
import { jarallax } from "jarallax";
import { TermsOfServiceComponent } from '../components/terms-of-service/terms-of-service.component';
import { IonStorageService } from '../shared/utils/ionstorage.service';
import { NavigationService } from '../shared/utils/navigation.service';

const COOKIES_ACCEPTED = 'cookiesAccepted';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonMenu
  ],
})
export class HomePage implements OnInit {

  @ViewChild(HTMLElement, { static: true }) menuEl!: HTMLElement;

  private storage = inject(IonStorageService);

  private nav = inject(NavigationService);

  pageTitle = 'Mini Mercado Amigão';

  isCookiePolicyAccepted: boolean = false;

  openPolicToastButtons: ToastButton[] = [
    {
      text: 'Open policy',
      handler: async () => {
        console.log('Open policy');
        this.showTermsModal();
      },
    },
    {
      text: 'Accept',
      handler: async () => {
        await this.storage.storageSet(COOKIES_ACCEPTED, true);
        this.isCookiePolicyAccepted = true;
      },
    },
    {
      text: 'Deny',
      handler: async () => {
        await this.storage.storageSet(COOKIES_ACCEPTED, false);
        this.isCookiePolicyAccepted = false;
      },
    }
  ];

  constructor(
    public platform: Platform,
    public modalController: ModalController,
    private toastController: ToastController
  ) {

  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {

  }

  ngAfterViewInit(): void {
    jarallax(document.querySelectorAll('.jarallax'), {});

    jarallax(document.querySelectorAll('.jarallax-img'), {
    });
  }

  ngOnInit() {
    this.storage.getKeyAsObservable(COOKIES_ACCEPTED)
      .pipe()
      .subscribe((isCookiePolicyAccepted: boolean) => {
        if (isCookiePolicyAccepted != null) {
          this.isCookiePolicyAccepted = isCookiePolicyAccepted;
        } else {
          this.cookiesToast();
        }
      });
  }

  cookiesToast() {
    setTimeout(() => {
      this.presentToast('bottom')
    }, 8000);
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServiceComponent
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
      setTimeout(() => {
        this.presentToast('bottom')
      }, 3000);
    });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const messageText = `
    Please, read our policy and accept the terms
    `;
    const toast = await this.toastController.create({
      message: messageText,
      position: position,
      cssClass: 'custom',
      layout: "stacked",
      buttons: this.openPolicToastButtons
      ,
    });

    await toast.present();
  }

  navigateFirstPage() {
    this.nav.navigateFadeOut('welcome');
  }

  scratchGame() {
    this.nav.navigateFadeOut('scratch-game');
  }

  welcomeGame() {
    this.nav.navigateFadeOut('welcome');
  }
}
