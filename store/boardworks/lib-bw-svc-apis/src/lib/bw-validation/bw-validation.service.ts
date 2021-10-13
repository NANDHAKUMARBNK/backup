import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BwValidationService {

  constructor() { }

  getValidatorErrorMessage(validatorName: string, fieldName: string, validatorValue?: any,customErrorMinLength?:any,customErrormaxLength?:any,customErrorReq?:any,customErrorPattern?:any,customErrormax?:any,customErrormin?:any) {
    let config: any = {};
    if (validatorName === 'customError') {
      config = {
        'customError': `${validatorValue}`,
      };
    } else {
      config = {
        'required':  customErrorReq || `${fieldName} is required.`,
        'minlength': customErrorMinLength ||  `Minimum length ${validatorValue.requiredLength}`,
        'pattern':  customErrorPattern || `Please enter valid ${fieldName}`,
        'maxlength':customErrormaxLength || `Maximum length is ${validatorValue.requiredLength}`,
        'min': customErrormin ||`${fieldName} value should not be lesser than ${validatorValue.min}`,
        'max': customErrormax || `${fieldName} value should not be greater than ${validatorValue.max}`,
      };
    }
    return config[validatorName];
  }


  static MatchPassword(AC: any) {
    const password = AC.get('newPassword').value;
    const confirmPassword = AC.get('confirmPassword').value;
    if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors({ customError: 'Password not matched' });
    } else {
      AC.get('confirmPassword').setErrors(null);
    }
  }

  static MatchPasswordForgot(AC: any) {
    const password = AC.get('NewPassword').value;
    const ConfirmNewPassword = AC.get('ConfirmNewPassword').value;
    if (password !== ConfirmNewPassword) {
      AC.get('ConfirmNewPassword').setErrors({ customError: 'Password not matched' });
    } else {
      AC.get('ConfirmNewPassword').setErrors(null);
    }
  }

  static MatchPasswordNew(AC: any) {
    const password = AC.get('newPassword').value;
    const confirmNewPassword = AC.get('confirmNewPassword').value;
    if (password !== confirmNewPassword) {
      AC.get('confirmNewPassword').setErrors({ customError: 'Password not matched' });
    } else {
      AC.get('confirmNewPassword').setErrors(null);
    }
  }

}
