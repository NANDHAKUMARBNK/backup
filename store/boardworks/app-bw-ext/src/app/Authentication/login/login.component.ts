import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'lib-bw-svc-apis/src/lib/login/login.service';
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  mfaForm: any;
  isMfa = false;
  isError = false;
  errMessage: any = [];
  successUsername: any;
  mfaSessionId: any;
  otpMaxTries: any;
  boards: any;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private storage: StorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });

    this.mfaForm = this.fb.group({
        username: ['', [Validators.required]],
        mfaSessionId: ['', [Validators.required]],
        code: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // this.loginForm.valueChanges.subscribe(res => {
    //   this.isError = false;
    // })
  }

  loginFunc() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.result) {
        if(res.result.user.account.isAccountExpired) {
          this.setError(['Your account has been expired. Please contact your administrator.']);
          return;
        }
        if(!res.result.user.account.isEnabled) {
          this.setError(['Your account has been disabled. Please contact your administrator.']);
          return;
        }
        const userToken = {
          token: res.result.accessToken,
          expiry: res.result.expiry
        }
        this.storage.setData('userToken', JSON.stringify(userToken));
        this.storage.setData('user', JSON.stringify(res.result.user));
        if(res.result.user.account.isPasswordExpired || res.result.user.account.isChangePasswordAtLogon) {
          this.router.navigate(['/login/change-password']);
          return;
        }
        if(res.result.mfa && res.result.mfa.isMfaRequired) {
          this.mfaSessionId = res.result.mfa.mfaSessionId;
          this.mfaForm.get('mfaSessionId').setValue(res.result.mfa.mfaSessionId);
          this.mfaForm.get('username').setValue(res.result.user.username);
          this.isMfa = true;
          this.otpMaxTries = res.result.mfa.maxTries;
          this.boards = res.result.boards;
          this.setError('');
          return;
        }
        this.storage.setData('boards', JSON.stringify(res.result.boards));
        if (res.result.boards && res.result.boards.length && res.result.boards.length > 1) {
          this.router.navigate(['/login/boards']);
        } else {
          this.loginService.selectBoardAndRolesAndPermission({ boardId: res.result.boards[0].clientBoardId }, 'auth').subscribe((val: any) => {
            if (!val.result.canUseBoard) {
              this.setError(['Cannot use board']);
            } else {
              const userToken2 = {
                token: val.result.token.accessToken,
                expiry: val.result.token.expiry
              }
              this.storage.setData('loggedInBoard', res.result.boards[0].clientBoardId);
              this.storage.setData('userToken', JSON.stringify(userToken2));
              this.storage.setData(
                "leftNavs",
                JSON.stringify(val.result.leftNavs)
              );
              this.storage.setData(
                "roles_data",
                JSON.stringify(val.result.userRole)
              );
              this.storage.setData(
                "pagePermission",
                JSON.stringify(val.result.permissions)
              );
              this.router.navigate(['/admin']);
            }
          }, err => {
            this.setError(err.error.result.errorMessages);
          })
        }
      }
    }, (err: any) => {
      this.setError(err.error.result.errorMessages);
    })
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  verifyOTP() {
    if (this.mfaForm.invalid) {
      this.mfaForm.markAllAsTouched();
      return;
    }

    this.loginService.verifyOtp(this.mfaForm.value).subscribe((res: any) => {
      if (res.result) {
        if(!res.result.success) {
          this.otpMaxTries = res.result.retriesLeft;
          this.setError([res.result.errorMessage || `${this.otpMaxTries} tries left`]);
          if(!this.otpMaxTries) {
            this.setError([res.result.errorMessage || 'Maximum limit exceeded, please check your credentials and try again']);
            this.isMfa = false;
            this.loginForm.reset();
            this.mfaForm.reset();
            this.boards = null;
            this.mfaSessionId = null;
            this.otpMaxTries = null;
            return;
          }
          return;
        }
        this.storage.setData('boards', JSON.stringify(this.boards));
        if (this.boards && this.boards.length && this.boards.length > 1) {
          this.router.navigate(['/login/boards']);
        } else {
          this.loginService.selectBoardAndRolesAndPermission({ boardId: this.boards[0].clientBoardId }, 'auth').subscribe((val: any) => {
            if (!val.result.canUseBoard) {
              this.setError(['Cannot use board']);
            } else {
              const userToken2 = {
                token: val.result.token.accessToken,
                expiry: val.result.token.expiry
              }
              this.storage.setData('loggedInBoard', this.boards[0].clientBoardId);
              this.storage.setData('userToken', JSON.stringify(userToken2));
              this.storage.setData(
                "leftNavs",
                JSON.stringify(val.result.leftNavs)
              );
              this.storage.setData(
                "roles_data",
                JSON.stringify(val.result.userRole)
              );
              this.storage.setData(
                "pagePermission",
                JSON.stringify(val.result.permissions)
              );
              this.router.navigate(['/admin']);
            }
          }, err => {
            this.setError(err.error.result.errorMessages);
          })
        }
      }
    }, (err: any) => {
      this.setError(err.error.result.errorMessages);
    })
  }
}
