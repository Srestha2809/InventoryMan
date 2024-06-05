import { AbstractControl } from '@angular/forms';

export function ValidatePostalCode(control: AbstractControl): { invalidPostalCode: boolean } | null {
    const CANADIAN_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    return !CANADIAN_POSTAL_CODE_REGEX.test(control.value) ? { invalidPostalCode: true } : null;
}
