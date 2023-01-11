import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { languageActions } from '../state/language/language.actions';
import { ILanguage, LanguageService, supportedLanguages } from '../state/language/language.service';

@Component({
    selector: 'rdb-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public readonly languages = supportedLanguages;
    public readonly date = new Date();

    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer, private store: Store, public languageService: LanguageService, public translateService: TranslateService) {
        matIconRegistry.addSvgIcon('github', domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/github-mark-white.svg'));
    }

    public onLanguageChange(language: ILanguage): void {
        this.store.dispatch(languageActions.changeLanguage({ language }));
    }
}
