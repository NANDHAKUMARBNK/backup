import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  recentUpdatesLoad: EventEmitter<any> = new EventEmitter();
  constructor(private httpService: HttpService) { }

  changePassword(request: any, noErrorPage?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.securityChangePassword}?navigate=${noErrorPage}`,
      request
    );
  }

  getSecurityQuestion() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.securitySQA}`
    );
  }

  changeSecurityQuestion(body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.securitySQA}`,
      body
    );
  }
  getRecentUpdatesInHome() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.recentUpdatesHome}`
    );
  }

  getRecentUpdates() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.recentUpdates}`
    );
  }
  getRecentUpdatesSettings() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.recentUpdates}/Settings`
    );
  }
  putRecentUpdatesSettings(request: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.recentUpdates}/Settings`,
      request
    );
  }

  getSearchedData(data: any) {
    const filterData = `?Keywords=${data.keyword}&StartDate=${data.startDate}&EndDate=${data.endDate}&SourceGroup=${data.area}&Page${data.pageNo || ''}&RecordsPerPage=${data.itemPerPage || ''}`
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.search}${filterData}`
    );
  }
}
