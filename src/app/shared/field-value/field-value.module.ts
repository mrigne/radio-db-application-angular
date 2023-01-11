import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FieldValueComponent } from './components/field-value.component';

@NgModule({
    imports: [CommonModule, TranslateModule],
    declarations: [FieldValueComponent],
    exports: [FieldValueComponent]
})
export class FieldValueModule {

}
