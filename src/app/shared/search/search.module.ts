import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from './components/search.component';

@NgModule({
    imports: [CommonModule, MatFormFieldModule, MatIconModule, A11yModule, MatInputModule, TranslateModule],
    declarations: [SearchComponent],
    exports: [SearchComponent]
})
export class SearchModule {}
