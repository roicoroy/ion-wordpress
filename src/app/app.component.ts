import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, call, camera, cameraOutline, cog, cogOutline, home, homeOutline, mail, menu, menuOutline, storefront, storefrontOutline, thumbsUp, thumbsUpOutline, homeSharp, heart } from 'ionicons/icons';
import { ProductsActions } from './store/products/products.actions';
import { AuthActions } from './store/auth/auth.actions';

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
    { title: 'Nd Graphics', url: '/nd-graphics', icon: 'eye' },
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Woo', url: '/product-list', icon: 'storefront' },
    { title: 'Login', url: '/login', icon: 'paper-plane' },
    { title: 'Register', url: '/register', icon: 'heart' },
    { title: 'Blog', url: '/posts', icon: 'archive' },
  ];

  private store = inject(Store);

  constructor() {
  }

  ngOnInit() {

    this.store.dispatch(new AuthActions.RefresUserState());

    addIcons({
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
  }

  logout() {
    this.store.dispatch(new AuthActions.AuthLogout());
  }
}

