import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetUsernameComponent } from './reset-username/reset-username.component';
import { LoginBoardComponent } from './login-board/login-board.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-username', component: ResetUsernameComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'boards', component: LoginBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
