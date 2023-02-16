import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { ValidationErrorMessageHelper } from 'src/helpers/validation-error-message.helper';
import { authActions } from '../../state/auth/auth.actions';
import { AuthService, ISignInRequest } from '../../state/auth/auth.service';

export interface ILoginForm {
    userName: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'rdb-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    public hidePassword$ = new BehaviorSubject<boolean>(true);
    public form = this.fb.group<ILoginForm>({
        userName: new FormControl<string>('', [Validators.required, Validators.minLength(4)]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });
    constructor(public validationErrorMessageHelper: ValidationErrorMessageHelper,
                private authService: AuthService,
                private fb: FormBuilder,
                private router: Router,
                private store: Store) {
    }

    public toggleHidePassword(): void {
        this.hidePassword$.next(!this.hidePassword$.value);
    }

    public onLogin() {
        this.store.dispatch(authActions.signIn(this.form.value as ISignInRequest));
    }
}
