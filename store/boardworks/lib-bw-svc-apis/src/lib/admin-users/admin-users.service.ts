import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class AdminUsersService {
  constructor(private httpService: HttpService) {}
  getAdminUsersCommittee() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminUsersCommittee}`
    );
  }
  getAdminUsersRoles() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminUsersRoles}`
    );
  }
  getAdminActiveUserReport() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminActiveUserReport}`
    );
  }
  getAdminUserRolesAndCommitteesReport() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminUserRolesAndCommitteesReport}`
    );
  }
  getUsersByRole() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminUsersRole}`
    );
  }

  updateAdminUserById(id: any, req: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.adminUsers}/${id}`,
      req
    );
  }
  getAdminUserById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.adminUsers}/${id}`
    );
  }
  postAdminResetPasswordById(id: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.securityResetPassword}/${id}`,
      {}
    );
  }
  deleteCommittee(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.committees}/${id}`
    );
  }
}
