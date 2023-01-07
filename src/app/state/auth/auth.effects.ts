import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { authActions } from './auth.actions';
import { AUTH_LOCAL_STORAGE_NAME, AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
    public signIn$ = createEffect(() => this.actions$.pipe(
        ofType(authActions.signIn),
        switchMap(loginData => {
            return this.authService.signin({ userName: loginData.userName, password: loginData.password }).pipe(
                map(signinResponse => authActions.storeAuthToken({ token: signinResponse.token })),
                catchError((err: HttpErrorResponse) => {
                    return of(authActions.loginFailed({ message: err.error?.message }));
                })
            );
        })
    ));
    public storeAuthToken$ = createEffect(() => this.actions$.pipe(
            ofType(authActions.storeAuthToken),
            tap(tokenPayload => {
                localStorage.setItem(AUTH_LOCAL_STORAGE_NAME, tokenPayload.token);
                this.router.navigate(['items']);
            })
        ), { dispatch: false }
    );

    public loginFailed$ = createEffect(() => this.actions$.pipe(
        ofType(authActions.loginFailed),
        tap(errorDetails => {
            this.snackbarService.showErrorSnackbar(errorDetails?.message || 'Something went wrong');
        })
    ), { dispatch: false })

    constructor(private actions$: Actions, private authService: AuthService, private snackbarService: SnackbarService, private router: Router) {
    }
}
