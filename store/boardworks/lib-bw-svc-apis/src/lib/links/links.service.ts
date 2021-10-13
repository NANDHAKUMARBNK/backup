import { EventEmitter, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { apiConstant } from '../constant/apiConstant';
import { environment } from 'environments/environment'
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LinksService {
  updateApiCallChangeRoute: EventEmitter<any> = new EventEmitter();
  private linksTabObs$: BehaviorSubject<any> = new BehaviorSubject(null);


  constructor(private httpService: HttpService) {

  }
  getLinkFloder() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.linksFloders}`,);
  };
  saveLinkFloder(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.linksFloders}`, payload);
  };
  updateLinkFloder(payload: any, id: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.linksFloders}/${id}`, payload);
  };
  getLinks() {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.links}`,);
  };
  saveLinks(payload: any) {
    return this.httpService.post(`${environment.baseUrl}${apiConstant.links}`, payload);
  };
  updateLinks(payload: any, id: any) {
    return this.httpService.put(`${environment.baseUrl}${apiConstant.links}/${id}`, payload);
  };
  deleteLinkFloder(id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.linksFloders}/${id}`,);
  };
  deleteLinks(id: any) {
    return this.httpService.delete(`${environment.baseUrl}${apiConstant.links}/${id}`,);
  };
  getLinkFloderById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.links}/${id}/Folders`,);
  }
  getLinksById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.linksFloders}/${id}/Links`,);
  }
  getEditFloderById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.linksFloders}/${id}`,);

  }
  getEditLinksById(id: any) {
    return this.httpService.get(`${environment.baseUrl}${apiConstant.links}/${id}`,);

  }


  getLinksTabObs(): Observable<any> {
    return this.linksTabObs$.asObservable();
  }

  setLinksTabObs(tab: any) {
    this.linksTabObs$.next(tab);
  };

 
}
