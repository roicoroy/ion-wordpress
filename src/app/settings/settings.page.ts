import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Share } from '@capacitor/share';
import { driver } from "driver.js";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateComponent } from '../components/translate/translate.component';
import { IonStorageService } from '../shared/utils/ionstorage.service';
import { ThemeService, DARK_MODE } from '../shared/utils/theme.service';
import { LanguageService, SAVED_LANGUAGE } from '../shared/language/language.service';
import { ILanguageModel } from '../shared/language/language.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateComponent,
    TranslateModule,
  ]
})
export class SettingsPage implements OnInit {

  pageTitle = 'Settings';

  settingsForm: FormGroup;

  darkModeModel: boolean | null = null;

  pushAcceptedModel: boolean | null = null;

  appDarkMode$!: Observable<any>;

  appDarkModeIcon$!: Observable<any>;

  icon!: string;

  availableLanguages!: ILanguageModel[] | any;

  translations: any;

  private storage = inject(Platform);

  private alert = inject(AlertController);

  constructor(
    private theme: ThemeService,
    private ionStorage: IonStorageService,
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
  ) {
    this.settingsForm = new FormGroup({
      'darkMode': new FormControl(null),
      'pushAccepted': new FormControl(null),
    });
  }

  driverInit() {
    const driverObj = driver({
      showProgress: true,
      popoverClass: 'driverjs-theme',
      popoverOffset: 0,
      steps: [
        { element: '#share-button', popover: { title: 'Compartilhe!', description: 'Envie as promoções para seus amigos', side: "bottom", align: 'end' } },
      ]
    });
    driverObj.drive();
  }

  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  ngOnInit() {

    this.ionStorage.getKeyAsObservable('pushAccepted')
      .pipe()
      .subscribe((isPushAccepted: boolean) => {
        this.pushAcceptedModel = isPushAccepted;
      });

    this.ionStorage.getKeyAsObservable(DARK_MODE)
      .pipe()
      .subscribe((isDarkMode: boolean) => {
        // console.log('appDarkMode', isDarkMode);
        this.darkModeModel = isDarkMode;
      });

    this.settingsForm.controls[DARK_MODE].valueChanges.subscribe(value => {
      this.darkModeModel = value;
    });

    this.settingsForm.controls['pushAccepted'].valueChanges.subscribe(value => {
      this.pushAcceptedModel = value;
      this.ionStorage.storageSet('pushAccepted', this.pushAcceptedModel)
    });
  }

  async onChangeTheme(ev: any) {
    await this.theme.changeTheme(ev);
  }

  async share() {
    const canShare = await Share.canShare();
    if (canShare.value) {
      await Share.share({
        title: 'Mini Mercado Amigão!',
        text: 'Melhor atendimento da região!',
        url: 'https://ion-phaser-adverts.web.app',
        dialogTitle: 'With fresh sausages',
      });
    } else {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alert.create({
      subHeader: 'Sorry..',
      message: 'Not able to share in this platform',
      buttons: ['OK'],
    });
    await alert.present();
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
      header: this.translations?.SELECT_LANGUAGE,
      inputs: this.availableLanguages,
      cssClass: 'language-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'translate-alert',
        },
        {
          text: 'Ok',
          handler: (shortLangCode) => {
            if (shortLangCode) {
              this.translate.use(shortLangCode);
              this.ionStorage.storageSet(SAVED_LANGUAGE, shortLangCode);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
