import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageNamePipe } from './language-name.pipe';

@NgModule({
    imports: [CommonModule],
    exports: [
        LanguageNamePipe
    ],
    declarations: [LanguageNamePipe]
})
export class LanguageNameModule {
}
