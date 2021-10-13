import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { StorageService } from "../storage/storage.service";
import { async } from "@angular/core/testing";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  //  http service is used for all httpClient methods to avoid writing large
  //  number of test cases and minium usage of httpClient

  public get(url: string, paramsObj?: any): Observable<any> {
    const token = async () => await this.checkBothTokensValidity(url);
    token();
    let httpParams = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach((key) => {
        if (paramsObj[key]) {
          httpParams = httpParams.append(key, paramsObj[key]);
        }
      });
    }
    return this.http.get<any>(url, { params: httpParams });
  }

  public post(url: string, body?: any, headers?: any): Observable<any> {
    const token = async () => await this.checkBothTokensValidity(url);
    token();
    return this.http.post(url, body);
  }

  public put(url: string, body: any = {}): Observable<any> {
    const token = async () => await this.checkBothTokensValidity(url);
    token();
    return this.http.put(url, body);
  }

  public delete(url: string, body?: any): Observable<any> {
    const token = async () => await this.checkBothTokensValidity(url);
    token();
    let httpParams = new HttpParams();
    if (body) {
      Object.keys(body).forEach((key) => {
        if (body[key]) {
          httpParams = httpParams.append(key, body[key]);
        }
      });
    }
    return this.http.delete(url, { params: httpParams });
  }
  public deleteWithBody(url: string, body?: any): Observable<any> {
    const token = async () => await this.checkBothTokensValidity(url);
    token();
    console.log(body,'body');
    
    return this.http.delete(url, body);
  }

  public patch(url: string, body?: any): Observable<any> {
    const token = async () => await this.checkBothTokensValidity(url);
    token();
    return this.http.patch(url, body);
  }

  checkBothTokensValidity(url: string) {
    if (url.includes("/Auth") || url.includes("authValid")) {
      return this.tokenAuthCheckAndGetToken("app");
    }
    if (!url.includes("/Auth") && !url.includes("authValid")) {
      return this.tokenAuthCheckAndGetToken("user");
    }
    return;
  }

  async tokenAuthCheckAndGetToken(type: any, rtoken?: any) {
    if (type === "app") {
      return await this.getAppToken();
    }
    if (type === "user") {
      return rtoken
        ? await this.getUserTokenNew()
        : await this.getUserTokenLocalRefresh();
    }
  }

  async getAppToken() {
    const strToken: any = this.storage.getData("appToken");
    let token: any = this.parseToken(strToken);

    if (this.isTokenExpired(token)) {
      token = await this.http
        .post(`${environment.baseUrl}Auth/token?newUserToken=auth`, {})
        .toPromise();
      this.storage.setData("appToken", JSON.stringify(token.result));
    }
    return token;
  }

  async ensureXsrf() {
    await this.http
      .get(`${environment.baseUrl}alive.do?t=` + Date.now())
      .toPromise();
  }

  async getUserTokenNew() {
    const newTokenObj = await this.http
      .post(`${environment.baseUrl}Auth/token/user`, {})
      .toPromise();
    this.storage.setData("userToken", JSON.stringify(newTokenObj));
    return newTokenObj;
  }

  async getUserTokenLocalRefresh() {
    const strURTokens: any = await this.storage.getData("userToken");
    let currURTokens: any = this.parseToken(strURTokens);

    if (currURTokens) {
      if (this.isTokenExpired(currURTokens)) {
        currURTokens = await this.http
          .post(`${environment.baseUrl}token/user`, {})
          .toPromise();
        this.storage.setData("userToken", JSON.stringify(currURTokens));
      }
      return currURTokens;
    }

    // throw new Error('Unable to determine current security context. Please login again.');
  }

  parseToken(strToken: any) {
    if (strToken) {
      return JSON.parse(strToken);
    }

    return null;
  }

  isTokenExpired(token: any) {
    if (token) {
      const countDownDate = new Date(token.expiry + "z").getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;
      if (distance < 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
