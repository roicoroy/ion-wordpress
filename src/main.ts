import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WooInterceptor } from './app/shared/woo.interceptor';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { ProductsState } from './app/store/products/products.state';
import { register } from 'swiper/element/bundle';
import { AuthState } from './app/store/auth/auth.state';
import { CustomerState } from './app/store/customer/customer.state';
register();

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: WooInterceptor,
    //   multi: true
    // },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'ios',
      // navAnimation: fadeOutAnimation
    }),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(NgxsModule.forRoot([
      AuthState,
      CustomerState,
      ProductsState,
    ], {
      developmentMode: false,
    })),
    importProvidersFrom(NgxsReduxDevtoolsPluginModule.forRoot()),
    importProvidersFrom(NgxsLoggerPluginModule.forRoot({
      disabled: false,
    })),
    importProvidersFrom(NgxsStoragePluginModule.forRoot({
      key: [
        'auth',
        'customer',
        'products'
      ]
    })),
    importProvidersFrom(NgxsFormPluginModule.forRoot()),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideRouter(routes),
  ],
});
