import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const LANGUAGE_LOCAL_STORAGE_KEY = 'language';

export interface ILanguage {
    code: string;
    name: string;
}

export const supportedLanguages: ILanguage[] = [
    {
        code: 'en',
        name: 'English'
    },
    {
        code: 'uk',
        name: 'Українська'
    }
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
    public static defaultLanguage = 'en';

    constructor(private translateService: TranslateService) {
        const languageFromLocalStorage = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY);
        const languageFromBrowser = this.translateService.getBrowserLang();
        this.translateService.use(languageFromLocalStorage || (supportedLanguages.some(language => language.code === languageFromBrowser) ? languageFromBrowser : LanguageService.defaultLanguage));
    }

    public setLanguage(language: ILanguage) {
        this.translateService.use(language.code);
    }

    public getCurrentLanguage(): ILanguage {
        return supportedLanguages.find(supportedLanguage => supportedLanguage.code === this.translateService.currentLang);
    }
}
