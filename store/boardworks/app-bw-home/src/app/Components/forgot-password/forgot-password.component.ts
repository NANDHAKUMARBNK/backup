import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HomeService } from "lib-bw-svc-apis/src/lib/home/home.service";
import { BwValidationService } from 'lib-bw-svc-apis/src/lib/bw-validation/bw-validation.service';
import { Location } from '@angular/common';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  lists: any = [
    "Password must be a minimum of 9 characters,but not exceed 32 characters",
    "Password must contain at least one lower case,one upper case,one number",
    "Password cannot be your username,first name or last name",
    "Password cannot be the same as your last 6 passwords",
  ];
  changePasswordForm: FormGroup;
  isError = false;
  errMessage: any = [];
  // buttonProperties: any = [
  //   {
  //     buttonText: "CANCEL",
  //     className:
  //       "btn-base btn-contained secondary-btn-outlined btn-sm bw-font-sec-bold",
  //     buttonAction: "Cancel",
  //     isDisable: false,
  //     withIcon: false,
  //   },
  //   {
  //     buttonText: "CHANGE PASSWORD",
  //     className:
  //       "btn-base btn-contained secondary-btn-contained btn-sm bw-font-sec-bold me-md-4",
  //     buttonAction: "Password",
  //     isDisable: false,
  //     withIcon: false,
  //   },
  // ];
  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private route: Router,
    private location: Location
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(9), Validators.maxLength(32)
        ],
      ],
      newPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(9), Validators.maxLength(32)
        ],
      ],
      confirmNewPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(9), Validators.maxLength(32)
        ],
      ],
    }, {
      validators: BwValidationService.MatchPasswordNew
    });
  }
  seterror(e?: any) {
    // console.log(e);
  }
  ngOnInit(): void { }
  clickButton(e: any) {
    if (e === "Password") {
      if (this.changePasswordForm.invalid) {
        this.changePasswordForm.markAllAsTouched();
        return;
      }
      if (
        this.changePasswordForm.value.newPassword ===
        this.changePasswordForm.value.confirmNewPassword
      ) {
        const request: any = {
          oldPassword: this.changePasswordForm.value.currentPassword,
          newPassword: this.changePasswordForm.value.newPassword,
        };
        this.homeService.changePassword(request, 'noNavigate').subscribe(
          (response) => {
            console.log("response", response);
            if (response) {
              this.route.navigate(["login"]);
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
      } else {
        alert("New Password Is not Matched");
      }
    } else {
      // Cancel logic
      this.location.back();
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
