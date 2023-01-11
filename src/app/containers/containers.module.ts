import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ContentWithSidenavModule } from '../shared/content-with-sidenav/content-with-sidenav.module';
import { ContainersComponent } from './components/containers.component';
import { ContainerCreateEditComponent } from './container-create-update/container-create-edit.component';
import { ContainerDeleteComponent } from './container-delete/container-delete.component';
import { ContainersRoutingModule } from './containers.routing-module';

@NgModule({
    imports: [
        CommonModule,
        ContainersRoutingModule,
        ContentWithSidenavModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule,
        ReactiveFormsModule,
        A11yModule,
        TranslateModule
    ],
    declarations: [ContainersComponent, ContainerCreateEditComponent, ContainerDeleteComponent]
})
export class ContainersModule {}
