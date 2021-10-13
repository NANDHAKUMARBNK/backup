import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class EntitiesService {
  constructor(private httpService: HttpService) {}

  getCountries() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.countries}`
    );
  }

  getTimezones() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.settings}/${apiConstant.timezones}`
    );
  }

  getUsers() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.users}`);
  }

  getRoles() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.roles}`);
  }

  getAppointments() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.appointments}`
    );
  }

  getCommittee(withUsers?: any, onlyMeetingCommittees?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.entitiesCommittees}?withUsers=${
        withUsers || false
      }&onlyMeetingCommittees=${onlyMeetingCommittees || false}`
    );
  }
}
