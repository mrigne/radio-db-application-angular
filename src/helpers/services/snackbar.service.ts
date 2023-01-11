import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

type TTranslationParams = Record<string, string | number>

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(private matSnackBar: MatSnackBar, private translateService: TranslateService) {
    }

    public showInfoSnackbar(message: string, translationParams?: TTranslationParams): void {
        this.matSnackBar.open(this.translateService.instant(message, translationParams), undefined,{
            panelClass: 'info-snackbar'
        });
    }

    public showSuccessSnackbar(message: string, translationParams?: TTranslationParams): void {
        this.matSnackBar.open(this.translateService.instant(message, translationParams), undefined,{
            panelClass: 'success-snackbar'
        });
    }

    public showErrorSnackbar(message: string, translationParams?: TTranslationParams): void {
        this.matSnackBar.open(this.translateService.instant(message, translationParams), undefined,{
            panelClass: 'error-snackbar'
        });
    }
}
