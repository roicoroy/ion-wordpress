import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { ILanguageModel } from './language.model';
import { IonStorageService } from '../utils/ionstorage.service';
import { Subject, takeUntil } from 'rxjs';
export const SAVED_LANGUAGE = 'saved_language';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languages: ILanguageModel[] = new Array<ILanguageModel>();

  stop$ = new Subject<void>();

  constructor(
    public translate: TranslateService,
    private storageService: IonStorageService
  ) { }

  getLanguages(): ILanguageModel[] {
    this.languages = [];
    this.languages.push(
      { name: 'English', code: 'en' },
      { name: 'Portuguese', code: 'pt' },
    );
    return this.languages;
  }

  async initTranslate() {
    const language = await Device.getLanguageCode();
    const deviceLanguage = await this.shortLanguage(language);
    const useLang = deviceLanguage.match(/en|pt/) ? deviceLanguage : 'en';
    if (useLang) {
      this.storageService.getKeyAsObservable(SAVED_LANGUAGE)
        .pipe(
          takeUntil(this.stop$)
        )
        .subscribe((lang) => {
          if (lang && lang !== undefined) {
            this.translate.use(lang);
          } else {
            this.translate.use(useLang);
            this.storageService.storageSet(SAVED_LANGUAGE, useLang);
          }
        });
    }
  }
  async shortLanguage(language: string | any) {
    if (language) {
      const short = language.value.split('-');
      return short[0];
    }
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }
}
