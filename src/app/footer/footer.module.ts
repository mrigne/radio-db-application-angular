import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageNameModule } from '../pipes/language-name/language-name.module';
import { FooterComponent } from './footer.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatToolbarModule,
        LanguageNameModule,
        MatMenuModule
    ],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule {}
