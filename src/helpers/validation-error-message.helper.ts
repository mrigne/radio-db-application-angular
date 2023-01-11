import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { isObject } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidationErrorMessageHelper {
    constructor(private translateService: TranslateService) {
    }

    public getErrorMessageByError(control: AbstractControl): Observable<string> {
        const errorKey = Object.keys(control.errors || {}).filter(key => control.errors?.[key])?.[0];
        const error = isObject(control.errors[errorKey]) ? control.errors[errorKey] : {};
        return this.translateService.stream(`formErrors.${errorKey}`, error);
    }
}
