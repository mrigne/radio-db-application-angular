import { Pipe, PipeTransform } from '@angular/core';
import { supportedLanguages } from '../../state/language/language.service';

@Pipe({
    name: 'rdbLanguageName'
})
export class LanguageNamePipe implements PipeTransform {
    public transform(value: string): string {
        return supportedLanguages.find(language => language.code === value)?.name || '';
    }
}
