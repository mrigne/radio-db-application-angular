import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizedLayoutComponent } from './authorized-layout/authorized-layout.component';
import { FooterModule } from './footer/footer.module';
import { reducers } from './reducers';
import { AuthEffects } from './state/auth/auth.effects';
import { ContainersEffects } from './state/containers/containers.effects';
import { ItemsEffects } from './state/items/items.effects';
import { LanguageEffects } from './state/language/language.effects';
import { LanguageService } from './state/language/language.service';
import { AuthInterceptor } from './state/requests/interceptors/auth.interceptor';
import { ToolbarComponent } from './toolbar/toolbar.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/l10n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        AuthorizedLayoutComponent,
        ToolbarComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler
            },
            defaultLanguage: LanguageService.defaultLanguage
        }),
        StoreModule.forRoot({
            ...reducers,
            router: routerReducer
        }),
        EffectsModule.forRoot([
            AuthEffects,
            ItemsEffects,
            ContainersEffects,
            LanguageEffects
        ]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        MatSnackBarModule,
        StoreRouterConnectingModule.forRoot(),
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule
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
