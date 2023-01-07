import { AbstractControl } from '@angular/forms';

export const getErrorMessageByError = (control: AbstractControl): string => {
    const errorKey = Object.keys(control.errors || {}).filter(key => control.errors?.[key])?.[0];
    const error = control.errors[errorKey];
    switch (errorKey) {
        case 'required':
            return 'Field is required';
        case 'minlength':
            return `Minimal length is ${error['requiredLength']}`;
        case 'max':
            return `Maximum amount is ${error['max']}`;
        case 'min':
            return `Minimal amount is ${error['min']}`;
        case 'barcode':
            return 'Container with entered barcode already exists'
        default:
            return '';
    }
}
