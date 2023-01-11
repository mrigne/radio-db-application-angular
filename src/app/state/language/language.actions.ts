import { createActionGroup, props } from '@ngrx/store';
import { ILanguage } from './language.service';

export const languageActions = createActionGroup({
    source: 'Language',
    events: {
        'Change language': props<{ language: ILanguage }>()
    }
});
