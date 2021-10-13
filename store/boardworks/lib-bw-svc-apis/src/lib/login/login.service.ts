import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { environment } from 'environments/environment';
import { apiConstant } from '../constant/apiConstant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpService: HttpService) {

  }

  login(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.login}?authValid=auth`, payload);
  }

  verifyOtp(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.verifyOTP}`, payload);
  }

  forgotUserName(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.forgotUsername}?authValid=auth`, payload);
  }

  forgotpassword(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.ForgotPassword}?authValid=auth`, payload);
  }

  selectBoardAndRolesAndPermission(payload: any, isAuth?: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.authLoginBoard}`, payload);
  }

  getUserQuestion(username?: any) {
    return this.httpService.get(`${environment.baseUrl}Security/SQA/${username}/Question?authValid=auth`);
  }

  validateUserQuestion(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${'Security/SQA/validate?authValid=auth'}`, payload);
  }

  setPasswordUser(payload: any) {
    return this.httpService.post(`${environment.baseUrl}Security/SQA/SetPassword?authValid=auth`, payload);
  }

  changePasswordLoginUser(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.authLoginChangePaasword}`, payload);
  }

  validateuserName(username: any) {
    return this.httpService.post(`${environment.baseUrl}Auth/ValidateUsername?authValid=auth`, {Username: username});
  }

  getBoards() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.authUserBoard}`
    );
  }

}
