import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WooInterceptor } from './app/shared/wooApi/woo.interceptor';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { ProductsState } from './app/store/products/products.state';
import { register } from 'swiper/element/bundle';
register();
import { AuthState } from './app/store/auth/auth.state';
import { CustomerState } from './app/store/customer/customer.state';
import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
registerLocaleData(localeEn, 'en');
registerLocaleData(localePt, 'pt');
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { KeypadModule } from './app/shared/native/keyboard/keypad.module';
import { SettingsState } from './app/store/settings/settings.state';
import { ErrorsLoggingState } from './app/store/errors-logging/errors-logging.state';
defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WooInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'en' },
    {
      // https://angular.io/guide/image-directive
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'ios',
      // navAnimation: fadeOutAnimation
    }),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(KeypadModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
    ),
    importProvidersFrom(NgxsModule.forRoot([
      AuthState,
      CustomerState,
      ProductsState,
      SettingsState,
      ErrorsLoggingState
    ], {
      developmentMode: false,
    }
    )),
    importProvidersFrom(NgxsReduxDevtoolsPluginModule.forRoot()),
    importProvidersFrom(NgxsLoggerPluginModule.forRoot({
      disabled: true,
    })),
    importProvidersFrom(NgxsStoragePluginModule.forRoot({
      key: [
        'auth',
        'customer',
        'products',
        'profile',
        'errors'
      ]
    })),
    importProvidersFrom(NgxsFormPluginModule.forRoot()),
    importProvidersFrom(IonicStorageModule.forRoot()),
    provideRouter(routes),
  ],
});
