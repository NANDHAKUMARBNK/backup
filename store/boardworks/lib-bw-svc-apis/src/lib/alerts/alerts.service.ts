import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "../http/http.service";
import { apiConstant } from "../constant/apiConstant";

@Injectable({
  providedIn: "root",
})
export class AlertsService {
  alertDocumentsRetain: EventEmitter<any> = new EventEmitter();
  constructor(private httpService: HttpService) {}
  getAlertsTemplates(archived?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.alertsTemplates}?includeArchived=${
        archived || false
      }`
    );
  }

  getAlertsPublished(archived?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.alertsPublished}?includeArchived=${
        archived || false
      }`
    );
  }

  getAlertsUnpublished(archived?: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.alertsUnpublished}?includeArchived=${
        archived || false
      }`
    );
  }
  getRecepientsCommittees() {
    return this.httpService.get(
      `${environment.baseUrl}${
        apiConstant.entitiesCommittees
      }?withUsers=${true}`
    );
  }
  addAlertTemplates(data?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.alertsTemplate}`,
      data
    );
  }
  addNewAlert(data?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.newAlert}`,
      data
    );
  }
  addNewAlertPublish(alertId?: any, body?: any) {
    // return this.httpService.post(
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.newAlert}/${alertId}/${apiConstant.alertsPublish}`,
      body
    );
  }
  addNewAlertUnPublish(alertId?: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.newAlert}/${alertId}/${apiConstant.alertsUnPublish}`,
      {}
    );
  }
  getAlertsTemplateById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.alerts}/${id}`
    );
  }

  updateAlertTemplates(id?: any, data?: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.alerts}/${id}`,
      data
    );
  }
  deleteAlertDocumentById(id?: any, document_id?: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.alerts}/${id}/${apiConstant.documents}/${document_id}`
    );
  }
  getDocumentById(id: any) {
    return this.httpService.get(
      `${environment.baseUrl}${apiConstant.alertDocuments}/${id}`
    );
  }

  deleteAlert(id: any) {
    return this.httpService.delete(
      `${environment.baseUrl}${apiConstant.alerts}/${id}`
    );
  }

  publishAlertTemplate(data: any) {
    return this.httpService.post(
      `${environment.baseUrl}${apiConstant.newAlert}/${apiConstant.alertsPublish}`,
      data
    );
  }
  archiveAndUnarchiveAlert(id?: any, mode?: any) {
    return this.httpService.put(
      `${environment.baseUrl}${apiConstant.alerts}/${id}/${mode}`
    );
  }
}
