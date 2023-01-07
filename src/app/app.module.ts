import { A11yModule } from '@angular/cdk/a11y';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizedLayoutComponent } from './authorized-layout/authorized-layout.component';
import { ContainerCreateEditComponent } from './containers/container-create-update/container-create-edit.component';
import { ContainerDeleteComponent } from './containers/container-delete/container-delete.component';
import { ContainersComponent } from './containers/containers.component';
import { ItemAddNewComponent } from './items/item-add-new/item-add-new.component';
import { ItemAddComponent } from './items/item-add/item-add.component';
import { ItemDeleteComponent } from './items/item-delete/item-delete.component';
import { ItemEjectComponent } from './items/item-eject/item-eject.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { reducers } from './reducers';
import { SearchComponent } from './search/search.component';
import { ContentWithSidenavModule } from './shared/content-with-sidenav/content-with-sidenav.module';
import { AuthEffects } from './state/auth/auth.effects';
import { ContainersEffects } from './state/containers/containers.effects';
import { ItemsEffects } from './state/items/items.effects';
import { AuthInterceptor } from './state/requests/interceptors/auth.interceptor';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthorizedLayoutComponent,
        ToolbarComponent,
        ContainersComponent,
        ItemsComponent,
        SearchComponent,
        LoginComponent,
        ItemEjectComponent,
        ItemAddComponent,
        ItemDeleteComponent,
        ItemAddNewComponent,
        ContainerDeleteComponent,
        ContainerCreateEditComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        StoreModule.forRoot({
            ...reducers,
            router: routerReducer
        }),
        EffectsModule.forRoot([
            AuthEffects,
            ItemsEffects,
            ContainersEffects
        ]),
        MatInputModule,
        ReactiveFormsModule,
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        MatSnackBarModule,
        A11yModule,
        MatDialogModule,
        MatSelectModule,
        MatSidenavModule,
        StoreRouterConnectingModule.forRoot(),
        ContentWithSidenavModule
    ],
    providers: [
        CookieService,
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                duration: 5000,
                panelCss: 'info-snackbar',
                horizontalPosition: 'center',
                verticalPosition: 'top'
            }
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
