import { createActionGroup, props } from '@ngrx/store';
import { ISignInRequest, ISignInResponse } from './auth.service';

export const authActions = createActionGroup({
    source: 'AUTH',
    events: {
        'Sign In': props<ISignInRequest>(),
        'Store Auth Token': props<ISignInResponse>(),
        'Login Failed': props<{ message: string; }>()
    }
})
