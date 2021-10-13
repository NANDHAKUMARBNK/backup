import { EventEmitter, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { apiConstant } from '../constant/apiConstant';
import { environment } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  constructor(private httpService: HttpService) {

  }
  getCollaborations() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.collaborations}`,);
  };
  getCommittee() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.entitiesCommittees}`,);
  };
  getAccessControl() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.entitiesCommitteesOfficerGroups}?withUsers=true`);
  };
  getMeetingsBasedOnComittee(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.collaborationsMeetings}/${id}/Meetings`);
  };
  createCollabortion(body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.collaborations}`, body);
  }
  saveDocuments(id: any, body: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.collaborations}/${id}/Documents`, body);
  }
  getCollaborationById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.collaborations}/${id}`,);
  };
  updateCollabortion(id: any, body: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.collaborations}/${id}`, body);
  }

  ViewDocument(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.collaborationsMeetings}/Documents/${id}`);
  }
  deleteCollabortion(id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.collaborations}/${id}`);
  }

  deleteDocumentCollabortion(id: any, docId: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.collaborations}/${id}/Documents/${docId}`);
  }


}
