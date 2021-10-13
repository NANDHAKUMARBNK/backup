import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'lib-bw-svc-apis/src/lib/login/login.service';
import { Router } from '@angular/router';
import { BwValidationService } from 'lib-bw-svc-apis/src/lib/bw-validation/bw-validation.service';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwords: FormGroup;
  isError = false;
  errMessage: any = [];
  isSuccess = false;
  message: any = '';
  isPasswordExpired: any;
  lists: any = [
    "Password must be a minimum of 9 characters,but not exceed 32 characters",
    "Password must contain at least one lower case,one upper case,one number",
    "Password cannot be your username,first name or last name",
    "Password cannot be the same as your last 6 passwords",
  ];
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private storage: StorageService
  ) {
    this.passwords = this.fb.group({
      OldPassword: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(32)]],
      NewPassword: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(32)]],
      ConfirmNewPassword: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(32)]]
    },
      {
        validators: BwValidationService.MatchPasswordForgot
      });
  }

  ngOnInit(): void {
    const data = this.storage.getData('user') && JSON.parse(this.storage.getData('user'));
    if (data && (data.account.isChangePasswordAtLogon || data.account.isPasswordExpired)) {
      this.isPasswordExpired = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  changepassword() {
    if (this.passwords.invalid) {
      this.passwords.markAllAsTouched();
      return;
    }
    this.isError = false;
    this.loginService.changePasswordLoginUser(this.passwords.value).subscribe((res: any) => {
      this.passwords.reset();
      this.isSuccess = true;
      this.storage.removeData('userToken');
      this.storage.removeData('user');
      this.timer(30);
    }, err => {
      this.setError(err.error.result && err.error.result.errorMessages);
    })
  }

  timer(x: any) {
    if (x === 0) {
      this.router.navigate(['/login'])
      return;
    }
    this.message = x;
    return setTimeout(() => { this.timer(--x); }, 1000);
  }


  setError(err: any) {
    this.isError = true;
    this.errMessage = err;
  }

}
