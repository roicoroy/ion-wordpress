import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, call, camera, cameraOutline, cog, cogOutline, home, homeOutline, mail, menu, menuOutline, storefront, storefrontOutline, thumbsUp, thumbsUpOutline, homeSharp, heart, share } from 'ionicons/icons';
import { ProductsActions } from './store/products/products.actions';
import { AuthActions } from './store/auth/auth.actions';
import { Observable } from 'rxjs';
import { AppFacade, IAppFacadeModel } from './app.facade';
import { Platform } from '@ionic/angular';
import { LanguageService } from './shared/language/language.service';
import { ThemeService } from './shared/utils/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Nd Graphics', url: '/nd-graphics', icon: 'bookmark' },
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Woo', url: '/product-list', icon: 'storefront' },
    { title: 'Login', url: '/login', icon: 'paper-plane' },
    { title: 'Blog', url: '/posts', icon: 'archive' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
  ];

  viewState$!: Observable<IAppFacadeModel>;

  private store = inject(Store);

  private facade = inject(AppFacade);

  private language = inject(LanguageService);

  private theme = inject(ThemeService);

  private platform = inject(Platform);

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  async ngOnInit() {


    await this.appInit();
  }

  async appInit() {
    try {
      this.language.initTranslate();
      this.theme.themeInit();
      if (this.platform.is('android') || this.platform.is('ios')) {
      }
      this.store.dispatch(new AuthActions.RefresUserState());

      this.store.dispatch(new ProductsActions.RetrieveProducts());

      addIcons({
        share,
        homeSharp,
        home,
        storefront,
        camera,
        heart,
        menu,
        mail,
        cog,
        thumbsUp,
        homeOutline,
        storefrontOutline,
        cameraOutline,
        menuOutline,
        mailOutline,
        cogOutline,
        thumbsUpOutline,
        call,
        mailSharp,
        paperPlaneOutline,
        paperPlaneSharp,
        heartOutline,
        heartSharp,
        archiveOutline,
        archiveSharp,
        trashOutline,
        trashSharp,
        warningOutline,
        warningSharp,
        bookmarkOutline,
        bookmarkSharp
      });
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.AuthLogout());
  }
}

