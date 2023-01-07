import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { AUTH_LOCAL_STORAGE_NAME } from '../../app/state/auth/auth.service';
import { SnackbarService } from '../services/snackbar.service';

export const handleErrors = (router: Router, snackbarService: SnackbarService) => {
    return catchError<any, any>(err => {
        if (err?.status === 401) {
            localStorage.removeItem(AUTH_LOCAL_STORAGE_NAME);
            router.navigate(['/login']);
        } else {
            snackbarService.showErrorSnackbar(err.error?.message);
        }

        return EMPTY;
    })
}
