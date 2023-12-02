import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { LanguageService, SAVED_LANGUAGE } from 'src/app/shared/language/language.service';
import { IonStorageService } from 'src/app/shared/utils/ionstorage.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule
  ],
})
export class TranslateComponent {
  profile: any;
  availableLanguages: any = [];
  translations: any;
  translateSub: Subscription | any;
  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private storageService: IonStorageService
  ) {
    this.getTranslations();
  }

  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  async openLanguageChooser() {
    this.availableLanguages = this.languageService.getLanguages()
      .map((item: any) => ({
        name: item.name,
        type: 'radio',
        label: item.name,
        value: item.code,
        checked: item.code === this.translate.currentLang
      })
      );

    const alert = await this.alertController.create({
      header: this.translations.SELECT_LANGUAGE,
      inputs: this.availableLanguages,
      cssClass: 'language-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'translate-alert',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data) {
              this.translate.use(data);
              this.storageService.storageSet(SAVED_LANGUAGE, data);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
