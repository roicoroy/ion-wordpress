import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Share } from '@capacitor/share';
import { driver } from "driver.js";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateComponent } from '../components/translate/translate.component';
import { IonStorageService } from '../shared/utils/ionstorage.service';
import { ThemeService, DARK_MODE } from '../shared/utils/theme.service';
import { LanguageService, SAVED_LANGUAGE } from '../shared/language/language.service';
import { ILanguageModel } from '../shared/language/language.model';
import { ISeetingsFacadeState, SettingsFacade } from './settngs.facade';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { ImagePickerComponent, onLoadImage } from '../components/image-picker/image-picker.component';
import { KeypadModule } from '../shared/native/keyboard/keypad.module';
import { Capacitor } from '@capacitor/core';

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
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ImagePickerComponent,
    KeypadModule,
  ]
})
export class SettingsPage implements OnInit, OnDestroy {

  pageTitle = 'Settings';

  settingsForm: FormGroup;

  pushAcceptedModel: boolean | null = null;

  pushAccepted = false;

  isDarkMode = false;

  appDarkMode$!: Observable<any>;

  appDarkModeIcon$!: Observable<any>;

  icon!: string;

  availableLanguages!: ILanguageModel[] | any;

  translations: any;

  userAvatar!: string;

  private platform = inject(Platform);

  private alert = inject(AlertController);

  private facade = inject(SettingsFacade);

  private ionStorage = inject(IonStorageService);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<ISeetingsFacadeState>;

  constructor(
    private theme: ThemeService,
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
  ) {

    this.viewState$ = this.facade.viewState$;

    this.settingsForm = new FormGroup({
      'darkMode': new FormControl(null),
      'pushAccepted': new FormControl(null),
    });
  }

  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  ionViewWillEnter(){
    this.ionStorage.getKeyAsObservable('userAvatar')
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((userAvatar: string) => {
      this.userAvatar = userAvatar;
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
        this.isDarkMode = isDarkMode;
      });

    this.settingsForm.controls[DARK_MODE].valueChanges
      .subscribe(value => {
        this.isDarkMode = value;
      });

    this.settingsForm.controls['pushAccepted'].valueChanges
      .subscribe(value => {
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

  async onFCMChange($event: any) {
    this.pushAccepted = $event.detail.checked;
    // let permStatus = await PushNotifications.checkPermissions();
    // console.log(permStatus);
    // this.facade.setFCMStatus(this.pushAccepted);
  }

  onDarkModeChange($event: any) {
    this.isDarkMode = $event.detail.checked;
    this.facade.setDarkMode(this.isDarkMode);
  }

  updateUser() {
    // console.log(this.userForm.value);
    // this.store.dispatch(new UserProfileActions.UpdateStrapiUser(this.userForm.value));
  }

  async onImagePicked(file: any) {
    const response = await fetch(file.webviewPath);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('files', blob, file.name);
    const userAvatar = await onLoadImage(file)
    this.ionStorage.storageRemove('userAvatar').then(() => {
      this.ionStorage.storageSet('userAvatar', userAvatar);
      this.userAvatar = userAvatar;
    });
    // return this.uploadProfilePicture(formData);
  }

  async uploadProfilePicture(formData: FormData) {
    this.facade.appUploadProfileImage(formData);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
