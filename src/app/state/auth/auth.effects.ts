import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { isNil } from 'lodash';
import { catchError, fromEvent, map, of, startWith, switchMap, tap, timer } from 'rxjs';
import { JwtHelper } from '../../../helpers/jwt.helper';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { AppRoutes } from '../../routes/app.routes';
import { authActions } from './auth.actions';
import { AUTH_LOCAL_STORAGE_NAME, AuthService } from './auth.service';

const MILLIS_BEFORE_EXPIRE_TO_REFRESH_TOKEN = 2 * 60 * 1000;

@Injectable()
export class AuthEffects {
    public signIn$ = createEffect(() => this.actions$.pipe(
        ofType(authActions.signIn),
        switchMap(loginData => {
            return this.authService.signin({ userName: loginData.userName, password: loginData.password }).pipe(
                map(signinResponse => authActions.storeAuthToken({ token: signinResponse.token })),
                catchError((err: HttpErrorResponse) => {
                    return of(authActions.loginFailed({ message: 'login.errors.incorrectCredentials' }));
                })
            );
        })
    ));
    public storeAuthToken$ = createEffect(() => this.actions$.pipe(
            ofType(authActions.storeAuthToken),
            tap(tokenPayload => {
                localStorage.setItem(AUTH_LOCAL_STORAGE_NAME, tokenPayload.token);
                window.dispatchEvent(new Event('storage'));
                this.router.navigateByUrl(AppRoutes.items.full());
            })
        ), { dispatch: false }
    );

    public loginFailed$ = createEffect(() => this.actions$.pipe(
        ofType(authActions.loginFailed),
        tap(errorDetails => {
            this.snackbarService.showErrorSnackbar(errorDetails?.message || 'Something went wrong');
        })
    ), { dispatch: false })

    public logout$ = createEffect(() => this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
            localStorage.removeItem(AUTH_LOCAL_STORAGE_NAME);
            this.router.navigateByUrl(AppRoutes.login.login.full())
        })
    ), { dispatch: false });

    public initAuthToken$ = createEffect(() => this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        switchMap(() => {
            return fromEvent(window, 'storage').pipe(
                startWith(window.localStorage),
                switchMap(() => {
                    const authToken = localStorage.getItem(AUTH_LOCAL_STORAGE_NAME);
                    if (isNil(authToken) || JwtHelper.isTokenExpired(authToken)) {
                        return of(authActions.logout());
                    }
                    return timer(JwtHelper.getExpiryDate(authToken).getTime() - Date.now() - MILLIS_BEFORE_EXPIRE_TO_REFRESH_TOKEN).pipe(
                        map(() => authActions.refreshAuthToken())
                    );
                })
            );
        })
    ));

    public refreshAuthToken$ = createEffect(() => this.actions$.pipe(
        ofType(authActions.refreshAuthToken),
        switchMap(refreshAuthTokenAction => this.authService.refreshToken().pipe(
            map(response => {
                return authActions.storeAuthToken(response);
            }),
            catchError(() => {
                return of(authActions.logout());
            })
        ))
    ));

    constructor(private actions$: Actions, private authService: AuthService, private snackbarService: SnackbarService, private router: Router) {
    }
}
