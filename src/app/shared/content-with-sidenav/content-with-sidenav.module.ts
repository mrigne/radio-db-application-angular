import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ContentWithSidenavComponent } from './components/content-with-sidenav.component';



@NgModule({
    declarations: [ContentWithSidenavComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        RouterOutlet
    ],
    exports: [ContentWithSidenavComponent]
})
export class ContentWithSidenavModule { }
