import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, take, tap } from 'rxjs';
import { getErrorMessageByError } from 'src/helpers/validation-error-message.helper';
import { authActions } from '../state/auth/auth.actions';
import { AuthService } from '../state/auth/auth.service';

@Component({
    selector: 'rdb-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public readonly getErrorMessageByError = getErrorMessageByError;
    public hidePassword$ = new BehaviorSubject<boolean>(true);
    public form: FormGroup = this.fb.group({
        userName: new FormControl<string>('', [Validators.required, Validators.minLength(4)]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });
    constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private store: Store) {
    }

    public toggleHidePassword(): void {
        this.hidePassword$.next(!this.hidePassword$.value);
    }

    public onLogin() {
        this.store.dispatch(authActions.signIn(this.form.value));
        // this.authService.signin(this.form.value).pipe(
        //     tap(() => {
        //         this.router.navigate(['items']);
        //     })
        // ).subscribe();
    }
}
