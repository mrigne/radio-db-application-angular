import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { languageActions } from '../state/language/language.actions';
import { ILanguage, supportedLanguages } from '../state/language/language.service';

@Component({
    selector: 'rdb-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public readonly languages = supportedLanguages;
    public readonly date = new Date();

    constructor(private store: Store, public translateService: TranslateService) {
    }

    public onLanguageChange(language: ILanguage): void {
        this.store.dispatch(languageActions.changeLanguage({ language }));
    }
}
