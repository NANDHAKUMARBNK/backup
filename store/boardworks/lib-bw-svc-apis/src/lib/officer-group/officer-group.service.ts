import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'
import { HttpService } from '../http/http.service';
import { apiConstant } from '../constant/apiConstant'

@Injectable({
  providedIn: 'root'
})
export class OfficerGroupService {

  constructor(private httpService: HttpService) { }

  getOfficerGroups() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.officerGroups}`);
  };

  getOfficerGroupById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.officerGroups}/${id}`);
  }

  createOfficerGroups(body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.officerGroups}`, body);
  };

  updateOfficerGroups(body: any, id: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.officerGroups}/${id}`, body);
  };

  getEntitiesGroups() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.entitiesOfficerGroups}`);
  }


}
