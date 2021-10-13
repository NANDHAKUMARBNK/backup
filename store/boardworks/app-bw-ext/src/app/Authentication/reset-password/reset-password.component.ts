import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'lib-bw-svc-apis/src/lib/login/login.service';
import { BwValidationService } from 'lib-bw-svc-apis/src/lib/bw-validation/bw-validation.service';
@Component({
  selector: 'bw-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  username: FormGroup;
  questionAns: any;
  passwords: FormGroup;
  isError = false;
  errMessage: any = [];
  firstStep = true;
  secondStep = false;
  thirdStep = false;
  isSuccess = false;
  message: any = '';
  lists: any = [
    "Password must be a minimum of 9 characters,but not exceed 32 characters",
    "Password must contain at least one lower case,one upper case,one number",
    "Password cannot be your username,first name or last name",
    "Password cannot be the same as your last 6 passwords",
  ];


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.username = this.fb.group({
      username: ["", [Validators.required]],
      captcha: ['', [Validators.required]]
    });
    this.questionAns = this.fb.group({
      username: { value: '', disabled: true },
      question: { value: '', disabled: true },
      answer: ['', [Validators.required]]
    });
    this.passwords = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(32)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(32)]]
    },
      {
        validators: BwValidationService.MatchPassword
      });
  }

  ngOnInit(): void { }

  resetPassWordlidateNameVaFunc() {
    if (this.username.invalid) {
      this.username.markAllAsTouched();
      return;
    }
    const username: any = this.username.value;
    this.isError = false;
    this.loginService.validateuserName(username.username).subscribe((res: any) => {
      if (res.result) {
        this.firstStep = false;
        this.secondStep = true;
        this.thirdStep = false;
        this.questionAns.get('username').setValue((username.username));
        this.getQuestion(username);
      } else {
        this.setError([`Username does't exists`]);
      }
    }, err => {
      this.setError(err.error.result && err.error.result.errorMessages);
    })
  }

  getQuestion(username: any) {
    this.loginService.getUserQuestion(username.username).subscribe(res => {
      if (res.result) {
        this.questionAns.get('question').setValue(res.result);
      }
    }, err => {
      this.setError(err.error.result && err.error.result.errorMessages);
    })
  }

  validateQuestion() {
    if (this.questionAns.invalid) {
      this.questionAns.markAllAsTouched();
      return;
    }
    this.isError = false;
    const data = this.questionAns.getRawValue();
    this.loginService.validateUserQuestion(data).subscribe((res: any) => {
      this.firstStep = false;
      this.secondStep = false;
      this.thirdStep = true;
    }, err => {
      this.setError(err.error.result && err.error.result.errorMessages);
    })
  }

  changepassword() {
    if (this.passwords.invalid) {
      this.passwords.markAllAsTouched();
      return;
    }
    this.isError = false;
    const data = { ...this.questionAns.getRawValue(), ...this.passwords.getRawValue() };
    this.loginService.setPasswordUser(data).subscribe((res: any) => {
      this.username.reset();
      this.questionAns.reset();
      this.passwords.reset();
      this.isSuccess = true;
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
