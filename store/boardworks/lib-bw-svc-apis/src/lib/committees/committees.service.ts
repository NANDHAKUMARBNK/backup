import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'
import { HttpService } from '../http/http.service';
import { apiConstant } from '../constant/apiConstant'

@Injectable({
  providedIn: 'root'
})
export class CommitteesService {

  constructor(private httpService: HttpService) { }

  getCommittees() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.committees}`);
  };

  createCommittees(body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.committees}`, body);
  };

  getUsersCommittee() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.adminUsersCommittee}`);
  }

  getCommitteesById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.committees}/${id}`);
  };

  updateCommittees(body: any, id: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.committees}/${id}`, body);
  };

}
