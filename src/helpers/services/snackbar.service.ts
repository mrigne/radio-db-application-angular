import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(private matSnackBar: MatSnackBar) {
    }

    public showInfoSnackbar(message: string): void {
        this.matSnackBar.open(message, undefined,{
            panelClass: 'info-snackbar'
        });
    }

    public showSuccessSnackbar(message: string): void {
        this.matSnackBar.open(message, undefined,{
            panelClass: 'success-snackbar'
        });
    }

    public showErrorSnackbar(message: string): void {
        this.matSnackBar.open(message, undefined,{
            panelClass: 'error-snackbar'
        });
    }
}
