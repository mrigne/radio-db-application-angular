import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { languageActions } from './language.actions';
import { LANGUAGE_LOCAL_STORAGE_KEY, LanguageService } from './language.service';

@Injectable()
export class LanguageEffects {
    public changeLanguage$ = createEffect(() => this.actions$.pipe(
        ofType(languageActions.changeLanguage),
        tap(changeLanguageAction => {
            localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, changeLanguageAction.language.code);
            this.languageService.setLanguage(changeLanguageAction.language);
        })
    ), { dispatch: false });

    constructor(private actions$: Actions, private languageService: LanguageService) {
    }
}
