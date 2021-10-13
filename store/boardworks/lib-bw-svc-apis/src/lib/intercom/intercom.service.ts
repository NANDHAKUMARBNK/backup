import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

export interface intercomConfig {
  appId: any;
  isEnable: boolean;
  secretKey?: any;
}
@Injectable({
  providedIn: "root",
})
export class IntercomService {
  _win: any = window;

  constructor(private httpService: HttpService) {}

  initIntercomUser(conf: intercomConfig) {
    let usr = JSON.parse(sessionStorage.getItem("user") || "");
    // let role = JSON.parse(sessionStorage.getItem("roles_data") || "");

    let interconmConf = {
      app_id: conf.appId,
      alignment: "right",
      horizontal_padding: 20,
      vertical_padding: 20,
      name: usr.displayName,
      email: usr.email,
      user_id: usr.userId,
      user_hash: conf.secretKey,
      // TODO add below if we have a subapp
      // product_name: "productName",
      // user_role: role.name,
    };

    this._win.Intercom("boot", interconmConf);
  }

  initIntercom() {
    this.getIntercomConfig().subscribe(
      (res: any) => {
        console.log("res conf", res);
        if (res?.isEnable) {
          this.initIntercomUser(res);
        }
      },
      (_1) => {
        //  Manage default initialization here
      }
    );
  }

  getIntercomConfig() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.intercom}`
    );
  }

  destroyIntercom() {
    this._win.Intercom("shutdown");
  }
}
