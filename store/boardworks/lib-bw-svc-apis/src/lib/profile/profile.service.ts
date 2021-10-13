import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  updateApiCallProfilePicture: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) { }
  getProfile() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.profile}`);
  };
  getEntitiesCommittees() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.entitiesCommittees}`);
  };
  getProfileById(id: any) {
  
      return this.httpService.get(
        `${environment.baseUrl}${apiConstant.profile}/${id}`
      );
    

  }
  getletterFilter(letter: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.profile}?letterfilter=${letter}`
    );
  }
  getCommitteeFilter(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.profileCommittee}/${id}`
    );
  }
  getCommitteeLetterFilter(id: any, letter: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.profileCommittee}/${id}?letterfilter=${letter}`
    );
  }
  getdefalutCommitee() {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.defaultCommittee}`
    );
  }

  getprofilesThumbnails(body: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.profilesThumbnails}`,
      body
    );
  }
  updateProfileById(id: any, body: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.profile}/${id}`,
      body
    );
  }
  getProfileImageById(id: any, size: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.profile}/${id}/Image/${size}`
    );
  }
  deleteProfileImage(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.profile}/${id}/Image`
    );
  }

  uploadProfile(id: any, formData: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.profile}/${id}/Image`,
      formData
    );
  }
}
