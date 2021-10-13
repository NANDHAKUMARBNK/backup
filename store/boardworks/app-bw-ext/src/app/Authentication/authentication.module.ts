import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { ResetUsernameComponent } from './reset-username/reset-username.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginBoardComponent } from './login-board/login-board.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';


@NgModule({
  declarations: [
    LoginComponent,
    ResetUsernameComponent,
    ResetPasswordComponent,
    LoginBoardComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    LibBwUiCompCoreModule
  ],
  providers: [
    NotificationService,
    ToastrService
  ],
})
export class AuthenticationModule { }
