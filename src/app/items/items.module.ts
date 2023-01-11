import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ContentWithSidenavModule } from '../shared/content-with-sidenav/content-with-sidenav.module';
import { FieldValueModule } from '../shared/field-value/field-value.module';
import { SearchModule } from '../shared/search/search.module';
import { ItemsComponent } from './components/items.component';
import { ItemAddNewComponent } from './item-add-new/item-add-new.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { ItemEjectComponent } from './item-eject/item-eject.component';
import { ItemsRoutingModule } from './items.routing-module';

@NgModule({
    imports: [
        CommonModule,
        ItemsRoutingModule,
        ContentWithSidenavModule,
        MatDialogModule,
        ReactiveFormsModule,
        SearchModule,
        A11yModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        TranslateModule,
        FieldValueModule
    ],
    declarations: [ItemsComponent, ItemAddComponent, ItemAddNewComponent, ItemDeleteComponent, ItemEjectComponent]
})
export class ItemsModule {}
