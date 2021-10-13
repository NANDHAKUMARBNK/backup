import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'lib-bw-svc-apis/src/lib/login/login.service';
import { Router } from '@angular/router';
import { REGEX_CONSTANTS } from 'lib-bw-svc-apis/src/lib/constant/regex';

@Component({
  selector: 'bw-reset-username',
  templateUrl: './reset-username.component.html',
  styleUrls: ['./reset-username.component.css']
})
export class ResetUsernameComponent implements OnInit {

  resetUsername: FormGroup;
  isError = false;
  errMessage: any = [];
  successUsername = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.resetUsername = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(REGEX_CONSTANTS.email)]],
      lastName: ["", [Validators.required]],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  resetUsernameFunc() {
    if (this.resetUsername.invalid) {
      this.resetUsername.markAllAsTouched();
      return;
    }
    this.loginService.forgotUserName(this.resetUsername.value).subscribe((res: any) => {
      if (res.result) {
        this.successUsername = true;
        this.resetUsername.reset();
      }
    }, err => {
      this.setError(err.error.result.errorMessages);
    })
  }

  setError(err: any) {
    this.isError = true;
    this.errMessage = err;
  }
}
