import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IonStorageService } from './ionstorage.service';
export const DARK_MODE = 'darkMode';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ionStorage: IonStorageService
  ) { }

  themeInit() {
    this.ionStorage.getKeyAsObservable(DARK_MODE)
      .subscribe((darkMode: any) => {
        if (darkMode) {
          this.document.body.classList.toggle('dark', true);
        }
        if (!darkMode) {
          this.document.body.classList.toggle('dark', false);
        }
      });
  }

  async changeTheme(ev: any) {
    await this.ionStorage.storageSet(DARK_MODE, ev.detail.checked).then(() => {
      if (ev.detail.checked) {
        this.document.body.classList.toggle('dark', ev.detail.checked);
      }
      if (!ev.detail.checked) {
        this.document.body.classList.toggle('dark', ev.detail.checked);
      }
    });
  }
}
